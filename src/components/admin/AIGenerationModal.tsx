import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { GeminiService, type GeneratedQuestion } from '../../lib/GeminiService';
import { Wand2, Loader2, Check, AlertCircle, X } from 'lucide-react';

interface Props {
    objectiveId: string;
    objectiveTitle: string;
    onSuccess: () => void;
    onClose: () => void;
}

export default function AIGenerationModal({ objectiveId, objectiveTitle, onSuccess, onClose }: Props) {
    const [count, setCount] = useState(5);
    const [difficulty, setDifficulty] = useState('intermediate');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

    async function handleGenerate() {
        setLoading(true);
        setError(null);
        try {
            const questions = await GeminiService.generateQuestions(objectiveTitle, difficulty, count);
            setGeneratedQuestions(questions);
            setSelectedIndices(new Set(questions.map((_, i) => i))); // Select all by default
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to generate questions';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setLoading(true);
        setError(null);
        try {
            const selectedQuestions = generatedQuestions.filter((_, i) => selectedIndices.has(i));

            for (const q of selectedQuestions) {
                // Insert Question
                const { data: qData, error: qError } = await supabase
                    .from('questions')
                    .insert({
                        objective_id: objectiveId,
                        text: q.question,
                        type: 'multiple_choice',
                        points: 10,
                        explanation: q.explanation
                    })
                    .select()
                    .single();

                if (qError) throw qError;

                // Insert Answers
                const answersToInsert = q.options.map((opt, idx) => ({
                    question_id: qData.id,
                    text: opt,
                    is_correct: idx === q.correctAnswer
                }));

                const { error: aError } = await supabase
                    .from('answers')
                    .insert(answersToInsert);

                if (aError) throw aError;
            }

            onSuccess();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save questions';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    const toggleSelection = (index: number) => {
        const next = new Set(selectedIndices);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        setSelectedIndices(next);
    };

    return (
        <div className="fixed z-[60] inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <div className="relative bg-white dark:bg-slate-900 rounded-[32px] px-8 pt-10 pb-8 text-left overflow-hidden shadow-premium transform transition-all sm:my-8 sm:max-w-3xl sm:w-full border border-white/20 dark:border-slate-800">
                    <div className="absolute top-0 right-0 pt-8 pr-8">
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
                            <Wand2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">AI Quiz Generator</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Generating questions for <strong>{objectiveTitle}</strong></p>
                    </div>

                    {generatedQuestions.length === 0 ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Question Count</label>
                                    <select
                                        value={count}
                                        onChange={(e) => setCount(Number(e.target.value))}
                                        className="w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 font-bold text-slate-900 dark:text-white"
                                    >
                                        {[3, 5, 10, 15, 20].map(n => <option key={n} value={n}>{n} Questions</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Difficulty</label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 font-bold text-slate-900 dark:text-white"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center gap-3 font-medium">
                                    <AlertCircle className="h-5 w-5" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                                {loading ? 'Generating...' : 'Start Power Generation'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {generatedQuestions.map((q, i) => (
                                    <div
                                        key={i}
                                        onClick={() => toggleSelection(i)}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedIndices.has(i) ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 h-5 w-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all ${selectedIndices.has(i) ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                                {selectedIndices.has(i) && <Check className="h-3 w-3 " />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white mb-2">{q.question}</p>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    {q.options.map((opt, optIdx) => (
                                                        <div key={optIdx} className={`${optIdx === q.correctAnswer ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'}`}>
                                                            {optIdx === q.correctAnswer ? '✓ ' : '• '}{opt}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setGeneratedQuestions([])}
                                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                                >
                                    Rethink (Clear All)
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading || selectedIndices.size === 0}
                                    className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                                    Save {selectedIndices.size} Questions
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
