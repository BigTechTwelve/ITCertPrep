import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { Plus, Trash, Edit, ChevronRight, ArrowLeft, Upload } from 'lucide-react';

import BulkImportModal from './BulkImportModal';

type Certification = Database['public']['Tables']['certifications']['Row'];
type Objective = Database['public']['Tables']['objectives']['Row'];

interface Props {
    certification: Certification;
    onBack: () => void;
    onManageQuestions: (obj: Objective) => void;
}

export default function ObjectiveManager({ certification, onBack, onManageQuestions }: Props) {
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showImportModal, setShowImportModal] = useState(false);

    useEffect(() => {
        fetchObjectives();
    }, [certification.id]);

    async function fetchObjectives() {
        setLoading(true);
        const { data, error } = await supabase
            .from('objectives')
            .select('*')
            .eq('certification_id', certification.id)
            .order('created_at');

        if (error) console.error(error);
        if (data) setObjectives(data);
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (editingId) {
                const { error } = await supabase
                    .from('objectives')
                    .update({ title })
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('objectives')
                    .insert([{ title, certification_id: certification.id }]);
                if (error) throw error;
            }
            setTitle('');
            setEditingId(null);
            fetchObjectives();
        } catch (error) {
            console.error('Error saving objective:', error);
            alert('Failed to save objective.');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure? This will delete all questions in this objective.')) return;
        const { error } = await supabase.from('objectives').delete().eq('id', id);
        if (error) console.error(error);
        else fetchObjectives();
    }

    function handleEdit(obj: Objective) {
        setTitle(obj.title);
        setEditingId(obj.id);
    }



    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <button onClick={onBack} className="text-indigo-600 hover:text-indigo-900 mb-2 flex items-center">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Certifications
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Objectives: {certification.title}
                    </h2>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <Upload className="h-5 w-5 mr-2" />
                        Import CSV
                    </button>
                </div>
            </div>

            {/* Create/Edit Form */}
            <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New Objective Title (e.g. 1.0 Mobile Devices)"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    {editingId ? 'Update' : 'Add'}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => { setTitle(''); setEditingId(null); }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                )}
            </form>

            <div className="space-y-4">
                {loading ? (
                    <div className="p-12 text-center text-slate-500">Loading objectives...</div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {objectives.map((obj, idx) => (
                            <div
                                key={obj.id}
                                className="group relative bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-premium interactive-card transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => onManageQuestions(obj)}>
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                                            {obj.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            Click to manage questions
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(obj)}
                                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                                        title="Edit Title"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(obj.id)}
                                        className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                                        title="Delete Objective"
                                    >
                                        <Trash className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onManageQuestions(obj)}
                                        className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"
                                        title="Manage Questions"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && objectives.length === 0 && (
                    <div className="text-center py-16 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] text-slate-400">
                        <p className="text-lg font-bold">No objectives yet</p>
                        <p className="text-sm">Create one above or import from CSV.</p>
                    </div>
                )}
            </div>

            {showImportModal && (
                <BulkImportModal
                    certification={certification}
                    onClose={() => setShowImportModal(false)}
                    onImportComplete={() => {
                        setShowImportModal(false);
                        fetchObjectives();
                    }}
                />
            )}
        </div>
    );
}
