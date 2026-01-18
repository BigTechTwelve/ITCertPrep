import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { Plus, Search, Edit, Trash, AlertCircle } from 'lucide-react';
import FlashcardForm from './FlashcardForm';

type Flashcard = Database['public']['Tables']['flashcards']['Row'];

interface Props {
    userId: string;
}

export default function FlashcardManager({ userId }: Props) {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

    const fetchFlashcards = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('flashcards')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching flashcards:', error);
        } else {
            setFlashcards(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFlashcards();
    }, [userId]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this flashcard?')) return;
        try {
            const { error } = await supabase.from('flashcards').delete().eq('id', id);
            if (error) throw error;
            fetchFlashcards(); // Refresh list
        } catch (error) {
            console.error('Error deleting flashcard:', error);
            alert('Failed to delete.');
        }
    };

    const handleEdit = (card: Flashcard) => {
        setEditingCard(card);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setEditingCard(null);
        setShowForm(true);
    };

    const filteredCards = flashcards.filter(card =>
        card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.back.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-[var(--bg-card)] shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Search cards..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleAddNew}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Flashcard
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : filteredCards.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No flashcards found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'Try adjusting your search.' : 'Get started by creating a new flashcard.'}
                    </p>
                    {!searchTerm && (
                        <div className="mt-6">
                            <button
                                onClick={handleAddNew}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Create Flashcard
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCards.map((card) => (
                        <div key={card.id} className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Q: {card.front}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">A: {card.back}</p>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2 border-t border-gray-100 dark:border-gray-700 pt-2">
                                <button
                                    onClick={() => handleEdit(card)}
                                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(card.id)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <FlashcardForm
                    flashcard={editingCard}
                    onClose={() => setShowForm(false)}
                    onSave={() => {
                        setShowForm(false);
                        fetchFlashcards();
                    }}
                    userId={userId}
                />
            )}
        </div>
    );
}
