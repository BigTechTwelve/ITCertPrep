import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Box, Calendar, Users, Shield } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';
import type { Database } from '../../types/supabase';

type Class = Database['public']['Tables']['classes']['Row'] & {
    instructor?: {
        full_name: string | null;
        email: string | null;
        avatar_url: string | null;
    }
};

interface ClassManagerProps {
    onBack?: () => void;
}

export default function ClassManager({ onBack }: ClassManagerProps) {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            // Fetch classes with instructor details
            // Note: We need to join manually or use a view if RLS allows. 
            // For now, let's fetch classes and then profiles, or use a manual join if referenced correctly.
            // Assuming 'instructor_id' references profiles.

            const { data: classesData, error } = await supabase
                .from('classes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Fetch instructors manually to avoid complex join issues if FK missing or RLS strict
            if (classesData) {
                const instructorIds = [...new Set(classesData.map(c => c.instructor_id))];
                const { data: instructors } = await supabase
                    .from('profiles')
                    .select('id, full_name, email, avatar_url')
                    .in('id', instructorIds);

                const instructorMap = new Map(instructors?.map(i => [i.id, i]) || []);

                const joinedClasses: Class[] = classesData.map(c => ({
                    ...c,
                    instructor: instructorMap.get(c.instructor_id) || { full_name: 'Unknown', email: '', avatar_url: null }
                }));

                setClasses(joinedClasses);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-500" />
                    </button>
                )}
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Class Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">
                        Overview of Logic Environments
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <div key={cls.id} className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-800 transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600">
                                    <Box className="w-6 h-6" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${cls.is_active
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                    {cls.is_active ? 'Active' : 'Archived'}
                                </span>
                            </div>

                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 line-clamp-1" title={cls.name}>
                                {cls.name}
                            </h3>
                            <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                                {cls.description || "No description provided."}
                            </p>

                            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400 font-bold flex items-center gap-2">
                                        <Shield className="w-4 h-4" /> Instructor
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                                            {cls.instructor?.full_name || 'Unknown'}
                                        </span>
                                        <UserAvatar
                                            avatarUrl={cls.instructor?.avatar_url}
                                            fullName={cls.instructor?.full_name}
                                            size="xs"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400 font-bold flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Created
                                    </span>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                        {new Date(cls.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {classes.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Box className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No Active Classes</h3>
                            <p className="text-slate-500">Instructors haven't initialized any learning environments yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
