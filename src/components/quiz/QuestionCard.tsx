import type { Database } from '../../types/supabase';
import { Bookmark, Sparkles, X, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { GeminiService } from '../../lib/GeminiService';
import { useSettings } from '../../hooks/useSettings';

type Question = Database['public']['Tables']['questions']['Row'] & {
    answers: Database['public']['Tables']['answers']['Row'][];
    explanation?: string | null; // Add optional explanation field if not yet in types
};

interface QuestionCardProps {
    question: Question;
    onAnswer: (answerId: string) => void;
    isAnswered: boolean;
    selectedAnswerId: string | null;
    onBookmark: () => void;
    isBookmarked: boolean;
}

export default function QuestionCard({ question, onAnswer, isAnswered, selectedAnswerId, onBookmark, isBookmarked }: QuestionCardProps) {
    const [explanation, setExplanation] = useState<string | null>(null);
    const [loadingExplanation, setLoadingExplanation] = useState(false);
    const { settings } = useSettings();

    const handleExplain = async () => {
        // If we already have a static explanation, use it!
        if (question.explanation) {
            setExplanation(question.explanation);
            return;
        }

        // Fallback to AI
        setLoadingExplanation(true);
        const correctAnswer = question.answers.find(a => a.is_correct)?.text || "Unknown";
        const userAnswer = question.answers.find(a => a.id === selectedAnswerId)?.text || "No answer";

        try {
            const text = await GeminiService.explainAnswer(question.text, correctAnswer, userAnswer);
            setExplanation(text);
        } catch (error) {
            console.error("AI Explanation failed:", error);
            setExplanation("Unable to generate explanation at this time.");
        } finally {
            setLoadingExplanation(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 shadow-premium rounded-[32px] p-8 md:p-10 relative border border-slate-200 dark:border-slate-800 fade-in transition-all">
            <button
                onClick={onBookmark}
                className={`absolute top-8 right-8 p-3 rounded-2xl transition-all ${isBookmarked
                    ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-inner'
                    : 'text-slate-300 hover:text-yellow-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                title="Save to Flashcards"
            >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400 mb-2 block">Question</span>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight pr-12">{question.text}</h3>
            </div>

            <div className="space-y-4">
                {question.answers.map((answer, idx) => {
                    const isSelected = selectedAnswerId === answer.id;
                    const letter = String.fromCharCode(65 + idx);

                    let containerClass = "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-center group relative overflow-hidden ";
                    let letterClass = "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm mr-4 transition-colors ";

                    if (isAnswered) {
                        if (answer.is_correct) {
                            containerClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-400 ";
                            letterClass += "bg-emerald-500 text-white ";
                        } else if (isSelected && !answer.is_correct) {
                            containerClass += "border-rose-500 bg-rose-50 dark:bg-rose-900/10 text-rose-900 dark:text-rose-400 ";
                            letterClass += "bg-rose-500 text-white ";
                        } else {
                            containerClass += "border-slate-100 dark:border-slate-800 bg-transparent text-slate-400 dark:text-slate-600 ";
                            letterClass += "bg-slate-100 dark:bg-slate-800 text-slate-400 ";
                        }
                    } else {
                        if (isSelected) {
                            containerClass += "border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-900 dark:text-white ";
                            letterClass += "bg-primary-500 text-white ";
                        } else {
                            containerClass += "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-primary-300 dark:hover:border-primary-700 text-slate-700 dark:text-slate-300 ";
                            letterClass += "bg-white dark:bg-slate-700 text-slate-500 group-hover:text-primary-600 ";
                        }
                    }

                    return (
                        <button
                            key={answer.id}
                            onClick={() => !isAnswered && onAnswer(answer.id)}
                            disabled={isAnswered}
                            className={containerClass}
                        >
                            <span className={letterClass}>{letter}</span>
                            <span className="font-bold text-base">{answer.text}</span>

                            {/* Correct/Incorrect Overlay Labels */}
                            {isAnswered && answer.is_correct && (
                                <span className="ml-auto text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white px-2 py-1 rounded-md">Correct</span>
                            )}
                            {isAnswered && isSelected && !answer.is_correct && (
                                <span className="ml-auto text-[10px] font-black uppercase tracking-widest bg-rose-500 text-white px-2 py-1 rounded-md">Incorrect</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {isAnswered && (
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                    {!explanation ? (
                        <div className="flex gap-4">
                            {/* Primary Button: Show Explanation (Static or AI) */}
                            {(question.explanation || settings.ai_enabled) && (
                                <button
                                    onClick={handleExplain}
                                    disabled={loadingExplanation}
                                    className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-black text-sm shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all disabled:opacity-50"
                                >
                                    {question.explanation ? (
                                        <>
                                            <Lightbulb className="w-4 h-4 mr-2" />
                                            Show Explanation
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            {loadingExplanation ? 'Summoning AI...' : 'Explain with AI'}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-primary-100 dark:border-primary-900/30 relative animate-fade-in shadow-inner">
                            <button
                                onClick={() => setExplanation(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-start">
                                <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-4">
                                    {question.explanation ? <Lightbulb className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-primary-700 dark:text-primary-400 uppercase tracking-tighter text-xs mb-2">
                                        {question.explanation ? 'Explanation' : 'Internalized Knowledge'}
                                    </h4>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                        {explanation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
