import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { User, Briefcase, ChevronRight, ShieldCheck } from 'lucide-react';

interface RoleOnboardingProps {
    onComplete: () => void;
}

export default function RoleOnboarding({ onComplete }: RoleOnboardingProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const selectRole = async (role: 'student' | 'teacher') => {
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role })
                .eq('id', user.id);

            if (error) throw error;
            onComplete();
        } catch (error) {
            console.error('Error setting role:', error);
            alert('Failed to set role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 py-12">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-12 fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-600 shadow-xl shadow-primary-500/20 mb-6">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Choose Your Path</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">To proceed with your deployment, we need to classify your operative role. Choose wisely, agent.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Student Path */}
                    <button
                        onClick={() => selectRole('student')}
                        disabled={loading}
                        className="group relative bg-white dark:bg-slate-900 p-8 rounded-[40px] border-2 border-slate-100 dark:border-slate-800 text-left transition-all hover:border-primary-500 hover:shadow-2xl hover:shadow-primary-500/10 active:scale-[0.98] disabled:opacity-50"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <User className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Student</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8">
                            Master new certifications, track your progress, and climb the global leaderboards.
                        </p>
                        <div className="flex items-center text-primary-600 font-black uppercase text-xs tracking-widest">
                            Join Mission <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>

                    {/* Teacher Path */}
                    <button
                        onClick={() => selectRole('teacher')}
                        disabled={loading}
                        className="group relative bg-white dark:bg-slate-900 p-8 rounded-[40px] border-2 border-slate-100 dark:border-slate-800 text-left transition-all hover:border-slate-600 dark:hover:border-slate-500 hover:shadow-2xl hover:shadow-slate-500/10 active:scale-[0.98] disabled:opacity-50"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Teacher</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8">
                            Deploy classes, manage operatives, and track engagement with advanced analytics.
                        </p>
                        <div className="flex items-center text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest">
                            Deploy Unit <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] opacity-50">Authorized Personnel Only</p>
                </div>
            </div>
        </div>
    );
}
