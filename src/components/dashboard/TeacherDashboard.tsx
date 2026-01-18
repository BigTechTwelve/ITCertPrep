import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../types/supabase';
import { Users, BookOpen, Plus, X, Copy, Check, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

type Class = Database['public']['Tables']['classes']['Row'] & {
    pathways: Database['public']['Tables']['pathways']['Row'];
    code?: string;
    enrollment_count?: number;
};

type Pathway = Database['public']['Tables']['pathways']['Row'];

import QuestionManager from './QuestionManager';

export default function TeacherDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'classes' | 'questions'>('classes');
    const [classes, setClasses] = useState<Class[]>([]);
    const [pathways, setPathways] = useState<Pick<Pathway, 'id' | 'title'>[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [selectedPathway, setSelectedPathway] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    async function fetchData() {
        try {
            if (user) {
                // Fetch classes with enrollment count
                const { data: classData, error } = await supabase
                    .from('classes')
                    .select(`
                        id, title, code, pathway_id,
                        pathways (id, title),
                        class_enrollments (count)
                    `)
                    .eq('teacher_id', user.id);

                if (error) throw error;

                if (classData) {
                    const formattedClasses = classData.map((c: any) => ({
                        ...c,
                        enrollment_count: c.class_enrollments[0]?.count || 0
                    }));
                    setClasses(formattedClasses);
                }

                const { data: pathwayData, error: pathwayError } = await supabase
                    .from('pathways')
                    .select('id, title');

                if (pathwayError) {
                    console.error('Error fetching pathways:', pathwayError);
                }

                if (pathwayData) setPathways(pathwayData);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!user) return;

            const { data, error } = await supabase
                .from('classes')
                .insert({
                    title: newClassName,
                    pathway_id: selectedPathway,
                    teacher_id: user.id
                })
                .select(`
                    *,
                    pathways (*)
                `)
                .single();

            if (error) throw error;

            if (data) {
                setClasses([...classes, { ...data, enrollment_count: 0 } as Class]);
                setShowCreateModal(false);
                setNewClassName('');
                setSelectedPathway('');
            }
        } catch (error) {
            console.error('Error creating class:', error);
        }
    };

    const copyCode = (code: string | undefined, id: string) => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <>
            <div className="space-y-8 fade-in">
                {/* Header / Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[32px] p-8 text-white shadow-premium relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-2 tracking-tight">Teacher Dashboard</h2>
                            <p className="text-indigo-100 font-medium mb-8">Manage your classrooms and track student progress.</p>

                            <div className="flex space-x-8">
                                <div>
                                    <div className="text-4xl font-black tracking-tighter">{classes.length}</div>
                                    <div className="text-sm font-bold opacity-70 uppercase tracking-widest">Active Classes</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black tracking-tighter">
                                        {classes.reduce((acc, curr) => acc + (curr.enrollment_count || 0), 0)}
                                    </div>
                                    <div className="text-sm font-bold opacity-70 uppercase tracking-widest">Total Students</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-300 dark:border-slate-700 p-8">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="group flex flex-col items-center justify-center w-full h-full space-y-4 hover:scale-105 transition-transform"
                        >
                            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                <Plus className="w-8 h-8 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-xl font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Create New Class</span>
                        </button>
                    </div>
                </div>

                {/* Dashboard Tabs */}
                <div className="flex space-x-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab('classes')}
                        className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'classes' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        Classrooms
                    </button>
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'questions' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        My Question Bank
                    </button>
                </div>

                {/* Content Area */}
                {activeTab === 'questions' ? (
                    <QuestionManager />
                ) : (
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Your Classrooms</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {classes.map((cls) => (
                                <div key={cls.id} className="group bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest">
                                            {cls.pathways?.title || 'General'}
                                        </span>
                                        <button className="p-2 -mr-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <Link to={`/class/${cls.id}`} className="block mb-6 group-hover:opacity-75 transition-opacity">
                                        <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                                            {cls.title}
                                        </h4>
                                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                                            <Users className="w-4 h-4 mr-2" />
                                            {cls.enrollment_count || 0} Students
                                        </div>
                                    </Link>

                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex items-center justify-between border border-slate-100 dark:border-slate-700">
                                        <div>
                                            <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">Join Code</div>
                                            <div className="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                                                {cls.code || 'Loading...'}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => copyCode(cls.code, cls.id)}
                                            className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-slate-500 hover:text-indigo-600 active:scale-95 transition-all"
                                            title="Copy Code"
                                        >
                                            {copiedId === cls.id ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {classes.length === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-400">
                                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No classes yet. Use the card above to create one.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Class Modal */}
            {showCreateModal && (
                <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowCreateModal(false)}
                    ></div>
                    <div className="flex min-h-full p-4 sm:p-12 md:p-20">
                        <div className="relative m-auto bg-white dark:bg-slate-900 rounded-[32px] px-8 pt-8 pb-8 text-left shadow-premium transform transition-all sm:max-w-lg sm:w-full border border-white/20 dark:border-slate-800">
                            <div className="absolute top-0 right-0 pt-6 pr-6">
                                <button
                                    type="button"
                                    className="text-slate-400 hover:text-slate-500 focus:outline-none"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="text-center mb-6">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
                                    <Plus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create New Class</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-2">Set up a new space for your students</p>
                            </div>

                            <form onSubmit={handleCreateClass} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Class Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:font-medium"
                                        placeholder="e.g. Period 3 - Cyber Security"
                                        value={newClassName}
                                        onChange={(e) => setNewClassName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Pathway / Certification</label>
                                    <select
                                        required
                                        className="block w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        value={selectedPathway}
                                        onChange={(e) => setSelectedPathway(e.target.value)}
                                    >
                                        <option value="">Select a pathway...</option>
                                        {pathways.map(p => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mt-6 flex gap-4">
                                    <button
                                        type="button"
                                        className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        onClick={() => setShowCreateModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newClassName || !selectedPathway}
                                        className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:shadow-none"
                                    >
                                        Create Class
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
