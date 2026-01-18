import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Database } from '../../types/supabase';

type Question = Database['public']['Tables']['questions']['Row'] & {
    profiles?: { full_name: string };
    objectives?: { title: string; certifications: { title: string } };
    visibility?: 'public' | 'private'; // Manually adding for now until types regen
};



export default function QuestionManager() {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Partial<Question> & { visibility: 'public' | 'private' }>({
        text: '',
        type: 'multiple_choice',
        points: 10,
        explanation: '',
        visibility: 'public'
    });
    const [answers, setAnswers] = useState<{ text: string; is_correct: boolean }[]>([]);
    const [objectives, setObjectives] = useState<{ id: string; title: string; cert_title: string }[]>([]);

    useEffect(() => {
        if (user) {
            fetchQuestions();
            fetchObjectives();
        }
    }, [user]);

    async function fetchQuestions() {
        try {
            const { data, error } = await supabase
                .from('questions')
                .select(`
                    *,
                    profiles(full_name),
                    objectives(title, certifications(title))
                `)
                .eq('created_by', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setQuestions(data || []);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchObjectives() {
        const { data } = await supabase
            .from('objectives')
            .select('id, title, certifications(title)');

        if (data) {
            setObjectives(data.map((o: any) => ({
                id: o.id,
                title: o.title,
                cert_title: o.certifications?.title
            })));
        }
    }

    async function handleSave() {
        if (!currentQuestion.text || !currentQuestion.objective_id) return;

        try {
            let qId = currentQuestion.id;

            // 1. Insert/Update Question
            if (currentQuestion.id) {
                const { error } = await supabase
                    .from('questions')
                    .update({
                        text: currentQuestion.text,
                        type: currentQuestion.type,
                        points: currentQuestion.points,
                        explanation: currentQuestion.explanation,
                        visibility: currentQuestion.visibility,
                        objective_id: currentQuestion.objective_id
                    })
                    .eq('id', currentQuestion.id);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('questions')
                    .insert({
                        text: currentQuestion.text,
                        type: currentQuestion.type,
                        points: currentQuestion.points,
                        explanation: currentQuestion.explanation,
                        visibility: currentQuestion.visibility,
                        objective_id: currentQuestion.objective_id,
                        created_by: user?.id
                    })
                    .select()
                    .single();

                if (error) throw error;
                qId = data.id;
            }

            // 2. Handle Answers (Full replace for simplicity)
            if (qId) {
                // Delete existing options
                await supabase.from('answers').delete().eq('question_id', qId);

                // Insert new options
                if (answers.length > 0) {
                    await supabase.from('answers').insert(
                        answers.map(a => ({
                            question_id: qId,
                            text: a.text,
                            is_correct: a.is_correct
                        }))
                    );
                }
            }

            setIsEditing(false);
            fetchQuestions();
            setCurrentQuestion({ text: '', type: 'multiple_choice', points: 10, visibility: 'public' });
            setAnswers([]);

        } catch (error) {
            alert('Error saving question');
            console.error(error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure?')) return;
        const { error } = await supabase.from('questions').delete().eq('id', id);
        if (!error) {
            setQuestions(questions.filter(q => q.id !== id));
        }
    }

    async function startEdit(q: Question) {
        // Fetch answers for this question
        const { data } = await supabase.from('answers').select('*').eq('question_id', q.id);

        setCurrentQuestion({
            ...q,
            visibility: (q.visibility as 'public' | 'private') || 'public'
        });

        setAnswers(data?.map(a => ({ text: a.text, is_correct: a.is_correct })) || []);
        setIsEditing(true);
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            {!isEditing ? (
                <>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Question Bank</h2>
                            <p className="text-slate-500 font-medium">Manage your {questions.length} custom questions</p>
                        </div>
                        <button
                            onClick={() => {
                                setCurrentQuestion({ text: '', type: 'multiple_choice', points: 10, visibility: 'public', objective_id: objectives[0]?.id });
                                setAnswers([{ text: '', is_correct: true }, { text: '', is_correct: false }]);
                                setIsEditing(true);
                            }}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create New
                        </button>
                    </div>

                    <div className="space-y-4">
                        {questions.length === 0 && <p className="text-slate-400 italic">No questions created yet.</p>}
                        {questions.map(q => (
                            <div key={q.id} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors group">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded ${q.visibility === 'public' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                                {q.visibility}
                                            </span>
                                            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                                                {q.type.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">
                                                {q.objectives?.certifications?.title} - {q.objectives?.title}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">{q.text}</h4>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEdit(q)} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(q.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="animate-in slide-in-from-right-4 fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black">{currentQuestion.id ? 'Edit Question' : 'New Question'}</h3>
                        <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 font-bold">Cancel</button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Question Text</label>
                            <textarea
                                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border-none focus:ring-2 focus:ring-indigo-500"
                                rows={3}
                                value={currentQuestion.text}
                                onChange={e => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Type</label>
                                <select
                                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-none"
                                    value={currentQuestion.type}
                                    onChange={e => setCurrentQuestion({ ...currentQuestion, type: e.target.value as any })}
                                >
                                    <option value="multiple_choice">Multiple Choice</option>
                                    <option value="true_false">True / False</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Visibility</label>
                                <select
                                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-none"
                                    value={currentQuestion.visibility}
                                    onChange={e => setCurrentQuestion({ ...currentQuestion, visibility: e.target.value as any })}
                                >
                                    <option value="public">Public (Shared)</option>
                                    <option value="private">Private (Only Me)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Objective / Topic</label>
                            <select
                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-none"
                                value={currentQuestion.objective_id}
                                onChange={e => setCurrentQuestion({ ...currentQuestion, objective_id: e.target.value })}
                            >
                                <option value="">Select Topic...</option>
                                {objectives.map(o => (
                                    <option key={o.id} value={o.id}>{o.cert_title} - {o.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Explanation (Optional)</label>
                            <textarea
                                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border-none focus:ring-2 focus:ring-indigo-500"
                                rows={2}
                                placeholder="Explain why the correct answer is right..."
                                value={currentQuestion.explanation || ''}
                                onChange={e => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-4">Answers</label>
                            {answers.map((ans, idx) => (
                                <div key={idx} className="flex gap-3 mb-3">
                                    <button
                                        onClick={() => {
                                            const newAns = [...answers];
                                            // For MC, can have multiple correct? Usually single best answer for this simple app
                                            // Let's toggle for now
                                            newAns[idx].is_correct = !newAns[idx].is_correct;
                                            setAnswers(newAns);
                                        }}
                                        className={`p-3 rounded-xl transition-colors ${ans.is_correct ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                    <input
                                        type="text"
                                        className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-none"
                                        placeholder={`Option ${idx + 1}`}
                                        value={ans.text}
                                        onChange={e => {
                                            const newAns = [...answers];
                                            newAns[idx].text = e.target.value;
                                            setAnswers(newAns);
                                        }}
                                    />
                                    <button
                                        onClick={() => setAnswers(answers.filter((_, i) => i !== idx))}
                                        className="p-3 text-rose-400 hover:text-rose-600"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setAnswers([...answers, { text: '', is_correct: false }])}
                                className="text-sm font-bold text-indigo-500 hover:text-indigo-600 mt-2"
                            >
                                + Add Option
                            </button>
                        </div>

                        <div className="pt-6 flex justify-end gap-3">
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all"
                            >
                                Save Question
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
