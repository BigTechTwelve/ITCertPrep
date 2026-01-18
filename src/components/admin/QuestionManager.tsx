import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { Plus, Trash, Edit, ArrowLeft, CheckCircle, Circle, Wand2, Info } from 'lucide-react';
import AIGenerationModal from './AIGenerationModal';
import { useSettings } from '../../hooks/useSettings';

type Objective = Database['public']['Tables']['objectives']['Row'];
type Question = Database['public']['Tables']['questions']['Row'];
type Answer = Database['public']['Tables']['answers']['Row'];

interface QuestionWithAnswers extends Question {
    answers?: Answer[];
}

interface Props {
    objective: Objective;
    onBack: () => void;
}

export default function QuestionManager({ objective, onBack }: Props) {
    const [questions, setQuestions] = useState<QuestionWithAnswers[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<QuestionWithAnswers | null>(null);
    const [showAIModal, setShowAIModal] = useState(false);
    const { settings } = useSettings();

    // Form State
    const [formData, setFormData] = useState({
        text: '',
        points: 10,
        explanation: '',
        answers: [
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false }
        ]
    });

    useEffect(() => {
        fetchQuestions();
    }, [objective.id]);

    async function fetchQuestions() {
        setLoading(true);
        // Fetch questions
        const { data: qData, error: qError } = await supabase
            .from('questions')
            .select('*')
            .eq('objective_id', objective.id)
            .order('created_at');

        if (qError) {
            console.error('Error fetching questions:', qError);
            setLoading(false);
            return;
        }

        // Fetch answers for these questions
        // Note: For a real app, we might want to do this smarter or trust a join if we had one setup in types
        const questionsList = qData || [];
        const qIds = questionsList.map(q => q.id);

        if (qIds.length > 0) {
            const { data: aData, error: aError } = await supabase
                .from('answers')
                .select('*')
                .in('question_id', qIds);

            if (aError) console.error('Error fetching answers:', aError);

            const combined = questionsList.map(q => ({
                ...q,
                answers: aData?.filter(a => a.question_id === q.id) || []
            }));
            setQuestions(combined);
        } else {
            setQuestions(questionsList);
        }

        setLoading(false);
    }

    function openModal(q: QuestionWithAnswers | null = null) {
        setEditingQuestion(q);
        if (q) {
            // Edit mode
            setFormData({
                text: q.text,
                points: q.points || 10,
                explanation: q.explanation || '',
                // Pad with empty answers if fewer than 4 exist, just for UI consistency
                answers: (q.answers || []).length > 0
                    ? [...(q.answers || [])].map(a => ({ text: a.text, is_correct: a.is_correct || false }))
                    : [
                        { text: '', is_correct: false },
                        { text: '', is_correct: false },
                        { text: '', is_correct: false },
                        { text: '', is_correct: false }
                    ]
            });
            // Ensure we have at least 4 slots for editing if desired, or dynamic. 
            // For simplicity, let's stick to 4 options for multiple choice.
            while (formData.answers.length < 4) {
                // This logic is tricky inside state setter, better to clean up:
            }
        } else {
            // New mode
            setFormData({
                text: '',
                points: 10,
                explanation: '',
                answers: [
                    { text: '', is_correct: true }, // Default first to correct
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                    { text: '', is_correct: false }
                ]
            });
        }
        setShowModal(true);
    }

    function handleAnswerChange(index: number, field: 'text' | 'is_correct', value: string | boolean) {
        const newAnswers = [...formData.answers];
        if (field === 'is_correct' && value === true) {
            // If setting this one to true, set all others to false (single choice logic)
            newAnswers.forEach(a => a.is_correct = false);
        }
        // @ts-ignore
        newAnswers[index][field] = value;
        setFormData({ ...formData, answers: newAnswers });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            let questionId;

            if (editingQuestion) {
                // Update Question
                const { error } = await supabase
                    .from('questions')
                    .update({
                        text: formData.text,
                        points: formData.points,
                        explanation: formData.explanation
                    })
                    .eq('id', editingQuestion.id);
                if (error) throw error;
                questionId = editingQuestion.id;

                // Update Answers
                // Strateggy: Delete old answers and re-insert? Or update in place?
                // Deleting and re-inserting is easiest for now to handle count changes, 
                // but might break stats if we tracked by answer_id. 
                // For this MVP, we will delete all and re-create.
                await supabase.from('answers').delete().eq('question_id', questionId);
            } else {
                // Create Question
                const { data, error } = await supabase
                    .from('questions')
                    .insert([{
                        text: formData.text,
                        points: formData.points,
                        objective_id: objective.id,
                        type: 'multiple_choice',
                        explanation: formData.explanation
                    }])
                    .select()
                    .single();

                if (error) throw error;
                questionId = data.id;
            }

            // Insert Answers
            const answersToInsert = formData.answers
                .filter(a => a.text.trim() !== '') // Only insert filled answers
                .map(a => ({
                    question_id: questionId,
                    text: a.text,
                    is_correct: a.is_correct
                }));

            if (answersToInsert.length > 0) {
                const { error: aError } = await supabase
                    .from('answers')
                    .insert(answersToInsert);
                if (aError) throw aError;
            }

            setShowModal(false);
            fetchQuestions();
        } catch (error) {
            console.error('Error saving question:', error);
            alert('Failed to save question.');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            const { error } = await supabase.from('questions').delete().eq('id', id);
            if (error) throw error;
            fetchQuestions();
        } catch (error) {
            console.error('Error deleting question:', error);
            alert('Failed to delete question.');
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <>
            <div className="space-y-8 fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={onBack}
                            className="group flex items-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-bold transition-all mb-4"
                        >
                            <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm mr-2 group-hover:scale-110 transition-transform">
                                <ArrowLeft className="h-5 w-5" />
                            </div>
                            Back to Objectives
                        </button>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Questions: <span className="text-indigo-600 dark:text-indigo-400">{objective.title}</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage assessment content</p>
                    </div>
                    <div className="flex gap-4">
                        {settings.ai_enabled && (
                            <button
                                onClick={() => setShowAIModal(true)}
                                className="inline-flex items-center px-6 py-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-2xl border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                            >
                                <Wand2 className="h-5 w-5 mr-2" />
                                Generate with AI
                            </button>
                        )}
                        <button
                            onClick={() => openModal()}
                            className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all"
                        >
                            <Plus className="h-6 w-6 mr-2" />
                            New Question
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {questions.map((q, idx) => (
                        <div key={q.id} className="group bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 shadow-premium hover:shadow-xl transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xl">
                                            Q{idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                                {q.text}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
                                                    {q.points} Points
                                                </span>
                                                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-xs font-black uppercase tracking-widest">
                                                    {q.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openModal(q)}
                                            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                                            title="Edit Question"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(q.id)}
                                            className="p-3 text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                                            title="Delete Question"
                                        >
                                            <Trash className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="pl-16">
                                    <ul className="space-y-3">
                                        {q.answers?.map((a) => (
                                            <li key={a.id} className={`flex items-center text-sm p-3 rounded-xl transition-colors ${a.is_correct ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-100 dark:border-emerald-800' : 'text-slate-600 dark:text-slate-400 border border-transparent'}`}>
                                                {a.is_correct ? <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" /> : <Circle className="h-5 w-5 mr-3 text-slate-300 dark:text-slate-600 flex-shrink-0" />}
                                                {a.text}
                                            </li>
                                        ))}
                                    </ul>
                                    {q.explanation && (
                                        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm italic text-slate-500 dark:text-slate-400 flex gap-3">
                                            <Info className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                                            <span><strong>AI Explanation:</strong> {q.explanation}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {questions.length === 0 && (
                        <div className="p-16 text-center border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] text-slate-400">
                            <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-300">
                                <Plus className="w-10 h-10" />
                            </div>
                            <p className="text-xl font-bold mb-2">No questions yet</p>
                            <p className="text-sm">Get started by creating your first question for this objective.</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setShowModal(false)}></div>

                        <div className="relative bg-white dark:bg-slate-900 rounded-[32px] px-8 pt-10 pb-8 text-left overflow-hidden shadow-premium transform transition-all sm:my-8 sm:max-w-xl sm:w-full border border-white/20 dark:border-slate-800">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-8 text-center">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {editingQuestion ? 'Edit Question' : 'New Question'}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 mt-2">Design a challenging question</p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Question Text</label>
                                        <textarea
                                            required
                                            className="block w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:font-medium min-h-[100px]"
                                            rows={3}
                                            value={formData.text}
                                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                            placeholder="e.g. Which of the following is a secure protocol?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Explanation (Optional)</label>
                                        <textarea
                                            className="block w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:font-medium min-h-[80px]"
                                            rows={2}
                                            value={formData.explanation}
                                            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                            placeholder="Explain why the correct answer is right..."
                                        />
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-4">Answer Options <span className="ml-1 normal-case font-normal text-slate-400">(Select correct answer)</span></label>
                                        <div className="space-y-3">
                                            {formData.answers.map((answer, index) => (
                                                <div key={index} className="flex items-center gap-3 group">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="correct_answer"
                                                            checked={answer.is_correct}
                                                            onChange={(e) => handleAnswerChange(index, 'is_correct', e.target.checked)}
                                                            className="peer h-6 w-6 cursor-pointer appearance-none rounded-full border-2 border-slate-300 checked:border-indigo-500 checked:bg-indigo-500 transition-all"
                                                        />
                                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100">
                                                            <CheckCircle className="h-4 w-4" />
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder={`Option ${index + 1}`}
                                                        className={`flex-1 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all ${answer.is_correct ? 'ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                                                        value={answer.text}
                                                        onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-4">
                                    <button
                                        type="button"
                                        className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-95"
                                    >
                                        Save Question
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showAIModal && (
                <AIGenerationModal
                    objectiveId={objective.id}
                    objectiveTitle={objective.title}
                    onClose={() => setShowAIModal(false)}
                    onSuccess={() => {
                        setShowAIModal(false);
                        fetchQuestions();
                    }}
                />
            )}
        </>
    );
}
