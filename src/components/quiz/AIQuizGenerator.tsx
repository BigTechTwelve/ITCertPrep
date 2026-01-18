import { useState } from 'react';
import { GeminiService, type GeneratedQuestion } from '../../lib/GeminiService';
import { Bot, Sparkles, Loader, AlertCircle } from 'lucide-react';

interface AIQuizGeneratorProps {
    onQuizGenerated: (questions: GeneratedQuestion[]) => void;
}

export default function AIQuizGenerator({ onQuizGenerated }: AIQuizGeneratorProps) {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Intermediate');
    const [count, setCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const questions = await GeminiService.generateQuestions(topic, difficulty, count);
            onQuizGenerated(questions);
        } catch (err: any) {
            setError(err.message || 'Failed to generate quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
                <div className="flex items-center text-white mb-2">
                    <Bot className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl font-bold">AI Quiz Generator</h2>
                </div>
                <p className="text-indigo-100">
                    Propelled by Gemini AI. Generate a custom quiz on any topic instantly.
                </p>
            </div>

            <form onSubmit={handleGenerate} className="p-6 space-y-6">
                {error && (
                    <div className={`p-4 rounded-lg flex items-start border ${error.includes('Quota')
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                        }`}>
                        <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">{error.includes('Quota') ? 'Limit Reached' : 'Generation Failed'}</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        What topic do you want to study?
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Python Lists, CompTIA Security+, World History..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Difficulty
                        </label>
                        <select
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Question Count
                        </label>
                        <select
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                        >
                            <option value={5}>5 Questions</option>
                            <option value={10}>10 Questions</option>
                            <option value={15}>15 Questions</option>
                            <option value={20}>20 Questions</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !topic}
                    className={`w-full py-4 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${loading
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                >
                    {loading ? (
                        <>
                            <Loader className="w-6 h-6 mr-2 animate-spin" />
                            Generating Quiz...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-6 h-6 mr-2" />
                            Generate Quiz
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
