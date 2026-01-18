import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { Plus, Trash, Edit, X, Map } from 'lucide-react';

type Pathway = Database['public']['Tables']['pathways']['Row'];

export default function PathwayManager({ onBack }: { onBack: () => void }) {
    const [pathways, setPathways] = useState<Pathway[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPathway, setEditingPathway] = useState<Pathway | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    useEffect(() => {
        fetchPathways();
    }, []);

    async function fetchPathways() {
        setLoading(true);
        const { data, error } = await supabase
            .from('pathways')
            .select('*')
            .order('title');

        if (error) console.error('Error fetching pathways:', error);
        else setPathways(data || []);
        setLoading(false);
    }

    function openModal(pathway: Pathway | null = null) {
        setEditingPathway(pathway);
        setFormData({
            title: pathway?.title || '',
            description: pathway?.description || ''
        });
        setShowModal(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (editingPathway) {
                // Update
                const { error } = await supabase
                    .from('pathways')
                    .update({ title: formData.title, description: formData.description })
                    .eq('id', editingPathway.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('pathways')
                    .insert([{ title: formData.title, description: formData.description }]);
                if (error) throw error;
            }
            setShowModal(false);
            fetchPathways();
        } catch (error: any) {
            console.error('Error saving pathway:', error);
            alert(`Failed to save pathway: ${error.message || error.error_description || 'Unknown error'}`);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure? This will delete all classes in this pathway!')) return;
        try {
            const { error } = await supabase.from('pathways').delete().eq('id', id);
            if (error) throw error;
            fetchPathways();
        } catch (error) {
            console.error('Error deleting pathway:', error);
            alert('Failed to delete pathway.');
        }
    }

    if (loading) return <div>Loading pathways...</div>;

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
                                <span className="text-lg">←</span>
                            </div>
                            Back to Dashboard
                        </button>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Pathways</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage learning tracks and class groupings</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all text-lg"
                    >
                        <Plus className="h-6 w-6 mr-2" />
                        New Pathway
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pathways.map((pathway) => (
                        <div
                            key={pathway.id}
                            className="group relative bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-premium interactive-card transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest flex items-center">
                                    <Map className="w-3 h-3 mr-1" />
                                    PATHWAY
                                </span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openModal(pathway); }}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(pathway.id); }}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                                    >
                                        <Trash className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                                {pathway.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm line-clamp-3 mb-6">
                                {pathway.description || 'No description provided.'}
                            </p>

                            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    ACTIONS
                                </span>
                                <button
                                    onClick={() => openModal(pathway)}
                                    className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"
                                >
                                    Edit Details
                                </button>
                            </div>
                        </div>
                    ))}
                    {pathways.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 italic">
                            No pathways found. Create one to get started.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" onClick={() => setShowModal(false)}></div>

                        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                                            {editingPathway ? 'Edit Pathway' : 'New Pathway'}
                                        </h3>
                                        <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Title</label>
                                            <input
                                                type="text"
                                                required
                                                className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
                                                rows={3}
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
