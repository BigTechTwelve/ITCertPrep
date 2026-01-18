import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { X, Save } from 'lucide-react';

type Flashcard = Database['public']['Tables']['flashcards']['Row'];

interface Props {
    flashcard?: Flashcard | null;
    onClose: () => void;
    onSave: () => void;
    userId: string;
}

export default function FlashcardForm({ flashcard, onClose, onSave, userId }: Props) {
    const [front, setFront] = useState(flashcard?.front || '');
    const [back, setBack] = useState(flashcard?.back || '');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (flashcard) {
                // Update
                const { error } = await supabase
                    .from('flashcards')
                    .update({ front, back })
                    .eq('id', flashcard.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('flashcards')
                    .insert({
                        user_id: userId,
                        front,
                        back
                    });
                if (error) throw error;
            }
            onSave();
        } catch (error) {
            console.error('Error saving flashcard:', error);
            alert('Failed to save flashcard.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500/75 dark:bg-slate-900/80 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0 pointer-events-none">
                    <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full pointer-events-auto">
                        <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-xl leading-6 font-bold text-gray-900 dark:text-white">
                                    {flashcard ? 'Edit Flashcard' : 'Add Flashcard'}
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none bg-gray-100 dark:bg-slate-700 p-2 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-mark text-gray-700 dark:text-gray-300 font-bold mb-2">Question (Front)</label>
                                    <textarea
                                        required
                                        value={front}
                                        onChange={(e) => setFront(e.target.value)}
                                        rows={3}
                                        className="block w-full border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                                        placeholder="e.g., What is the default port for HTTP?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-mark text-gray-700 dark:text-gray-300 font-bold mb-2">Answer (Back)</label>
                                    <textarea
                                        required
                                        value={back}
                                        onChange={(e) => setBack(e.target.value)}
                                        rows={3}
                                        className="block w-full border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                                        placeholder="e.g., Port 80"
                                    />
                                </div>

                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-3 bg-blue-600 text-base font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50 transition-all"
                                    >
                                        <Save className="h-5 w-5 mr-2" />
                                        {saving ? 'Saving...' : 'Save Card'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-3 bg-white dark:bg-slate-800 text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
