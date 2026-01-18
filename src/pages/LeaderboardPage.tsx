import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Zap } from 'lucide-react';
import UserAvatar from '../components/common/UserAvatar';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [leaders, setLeaders] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // Fetch top 50
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'student')
                .order('points', { ascending: false })
                .limit(50);

            if (error) console.error('Error fetching leaderboard:', error);
            else setLeaders(data || []);

            setLoading(false);
        }
        fetchData();
    }, [user]);

    const getRankStyle = (index: number) => {
        switch (index) {
            case 0: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700';
            case 1: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
            case 2: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-700';
            default: return 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800';
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 blur-[120px] rounded-full"></div>

            <div className="max-w-7xl mx-auto px-4 pt-20 md:pt-24 pb-24 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] bg-gradient-to-br from-amber-400 to-orange-600 shadow-xl mb-6 shadow-orange-500/20">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
                        Global <span className="text-primary-600 dark:text-primary-400">Rankings</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Measuring synchronization levels across all operatives.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-premium overflow-hidden border border-white dark:border-slate-800 fade-in">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-4 p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <div className="col-span-2 text-center">Protocol</div>
                        <div className="col-span-6">Operative</div>
                        <div className="col-span-2 text-center">Sync</div>
                        <div className="col-span-2 text-right">Yield</div>
                    </div>

                    {/* List */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {leaders.map((leader, index) => {
                            const isCurrentUser = user?.id === leader.id;
                            return (
                                <div
                                    key={leader.id}
                                    className={`grid grid-cols-12 gap-4 items-center p-6 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/30 ${isCurrentUser ? 'bg-primary-50/50 dark:bg-primary-950/20 relative z-10' : ''}`}
                                >
                                    {/* Rank */}
                                    <div className="col-span-2 flex justify-center">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm border-2 ${getRankStyle(index)}`}>
                                            #{index + 1}
                                        </div>
                                    </div>

                                    {/* User */}
                                    <div className="col-span-6 flex items-center">
                                        <UserAvatar
                                            avatarUrl={leader.avatar_url}
                                            fullName={leader.full_name}
                                            email={leader.email}
                                            size="md"
                                            className="mr-4 shadow-sm border-2 border-white dark:border-slate-700"
                                        />
                                        <div>
                                            <div className={`font-black text-base tracking-tight ${isCurrentUser ? 'text-primary-700 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>
                                                {leader.full_name || 'Anonymous User'}
                                                {isCurrentUser && <span className="ml-2 text-[10px] bg-primary-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-black">You</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Streak */}
                                    <div className="col-span-2 flex justify-center items-center">
                                        <div className="px-3 py-1 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center font-black text-rose-500 shadow-sm border border-rose-100 dark:border-rose-900/30">
                                            <Zap className="w-3 h-3 mr-1.5 fill-current" />
                                            {leader.current_streak || 0}d
                                        </div>
                                    </div>

                                    {/* Points */}
                                    <div className="col-span-2 text-right">
                                        <div className={`text-xl font-black tabular-nums tracking-tighter ${isCurrentUser ? 'text-primary-600 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>
                                            {leader.points.toLocaleString()}
                                        </div>
                                        <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Total Points</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {leaders.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No students found yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
