import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { Plus, Trash, Edit, X, ChevronRight } from 'lucide-react';

type Certification = Database['public']['Tables']['certifications']['Row'];

interface Props {
    onBack: () => void;
    onManageObjectives: (cert: Certification) => void;
}

export default function CertificationManager({ onBack, onManageObjectives }: Props) {
    const [certs, setCerts] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCert, setEditingCert] = useState<Certification | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        provider: ''
    });

    useEffect(() => {
        fetchCerts();
    }, []);

    async function fetchCerts() {
        setLoading(true);
        const { data, error } = await supabase
            .from('certifications')
            .select('*')
            .order('title');

        if (error) console.error('Error fetching certifications:', error);
        else setCerts(data || []);
        setLoading(false);
    }

    function openModal(cert: Certification | null = null) {
        setEditingCert(cert);
        setFormData({
            title: cert?.title || '',
            provider: cert?.provider || ''
        });
        setShowModal(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (editingCert) {
                // Update
                const { error } = await supabase
                    .from('certifications')
                    .update({ title: formData.title, provider: formData.provider })
                    .eq('id', editingCert.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('certifications')
                    .insert([{ title: formData.title, provider: formData.provider }]);
                if (error) throw error;
            }
            setShowModal(false);
            fetchCerts();
        } catch (error) {
            console.error('Error saving certification:', error);
            alert('Failed to save certification.');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure? This will PERMANENTLY delete this certification and ALL its objectives/questions!')) return;
        try {
            setLoading(true);

            // 1. Get all objectives for this cert
            const { data: objectives } = await supabase
                .from('objectives')
                .select('id')
                .eq('certification_id', id);

            if (objectives && objectives.length > 0) {
                const objectiveIds = objectives.map(o => o.id);

                // 2. Delete all questions in these objectives
                // (Questions usually cascade answers, but let's be safe)
                const { error: qError } = await supabase
                    .from('questions')
                    .delete()
                    .in('objective_id', objectiveIds);

                if (qError) {
                    console.error('Error deleting questions:', qError);
                    // It might fail if UserProgress references questions. 
                    // But we'll try to proceed or throw.
                }

                // 3. Delete objectives
                const { error: oError } = await supabase
                    .from('objectives')
                    .delete()
                    .in('id', objectiveIds);

                if (oError) throw oError;
            }

            // 4. Delete certification
            const { error } = await supabase.from('certifications').delete().eq('id', id);
            if (error) throw error;

            fetchCerts();
        } catch (error) {
            console.error('Error deleting certification:', error);
            alert('Failed to delete certification. Check console for details.');
        } finally {
            setLoading(false);
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
                                <span className="text-lg">←</span>
                            </div>
                            Back to Dashboard
                        </button>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Certifications</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage available exams and courses</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all text-lg"
                    >
                        <Plus className="h-6 w-6 mr-2" />
                        New Certification
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certs.map((cert) => (
                        <div
                            key={cert.id}
                            className="group relative bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-premium interactive-card transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest">
                                    {cert.provider}
                                </span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openModal(cert); }}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(cert.id); }}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                                    >
                                        <Trash className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                                {cert.title}
                            </h3>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-400">Manage Content</span>
                                <button
                                    onClick={() => onManageObjectives(cert)}
                                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {certs.length === 0 && (
                        <button
                            onClick={() => openModal()}
                            className="flex flex-col items-center justify-center p-12 border-3 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] text-slate-400 hover:border-indigo-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group min-h-[250px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus className="w-8 h-8" />
                            </div>
                            <span className="font-bold text-lg">Create First Certification</span>
                        </button>
                    )}
                </div>

            </div>


            {/* Modal */}
            {
                showModal && (
                    <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                            <div
                                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                                onClick={() => setShowModal(false)}
                            ></div>

                            <div className="relative bg-white dark:bg-slate-900 rounded-[32px] px-8 pt-10 pb-8 text-left overflow-hidden shadow-premium transform transition-all sm:my-8 sm:max-w-lg sm:w-full border border-white/20 dark:border-slate-800">
                                <div className="absolute top-0 right-0 pt-6 pr-6">
                                    <button
                                        type="button"
                                        className="text-slate-400 hover:text-slate-500 focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="text-center mb-8">
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
                                            <Edit className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                            {editingCert ? 'Edit Certification' : 'New Certification'}
                                        </h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Title</label>
                                            <input
                                                type="text"
                                                required
                                                className="block w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g. CompTIA A+"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Provider</label>
                                            <input
                                                type="text"
                                                required
                                                className="block w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                placeholder="e.g. CompTIA"
                                                value={formData.provider}
                                                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                            />
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
                                            className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/25 transition-all"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
