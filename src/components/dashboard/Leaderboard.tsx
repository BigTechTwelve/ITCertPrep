import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { Trophy } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface LeaderItemProps {
    leader: Profile;
    index: number;
    isMe: boolean;
}

function LeaderItem({ leader, index, isMe }: LeaderItemProps) {
    return (
        <div
            className={`
                flex items-center justify-between p-4 rounded-2xl transition-all group relative overflow-hidden
                ${index === 0 ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-700/50 shadow-sm' :
                    index === 1 ? 'bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/40 dark:to-slate-800/20 border border-slate-200 dark:border-slate-700/50 shadow-sm' :
                        index === 2 ? 'bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-900/10 border border-orange-200 dark:border-orange-700/50 shadow-sm' :
                            isMe ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800' :
                                'hover:bg-slate-50 dark:hover:bg-slate-800/30 border border-transparent'}
            `}
        >
            <div className="flex items-center gap-3 min-w-0 overflow-hidden relative z-10">
                <div className={`
                    flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shadow-sm
                    ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30' :
                        index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-lg shadow-slate-500/30' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}
                `}>
                    #{index + 1}
                </div>

                <UserAvatar
                    avatarUrl={leader.avatar_url}
                    fullName={leader.full_name}
                    email={leader.email}
                    size="sm"
                    className="border-2 border-white dark:border-slate-800 shadow-sm"
                />

                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <p className={`font-black text-sm truncate ${isMe ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                            {leader.full_name || 'Anonymous'}
                        </p>
                        {isMe && (
                            <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-indigo-600 text-[8px] font-black text-white uppercase tracking-tighter">You</span>
                        )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter italic">
                        Level {Math.floor((leader.points || 0) / 1000) + 1} Operative
                    </p>
                </div>
            </div>

            <div className="text-right relative z-10">
                <p className={`text-sm font-black tabular-nums tracking-tighter ${isMe ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                    {(leader.points || 0).toLocaleString()}
                </p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Points</p>
            </div>
        </div>
    );
}

export default function Leaderboard() {
    const [leaders, setLeaders] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<Profile | null>(null);
    const [currentRank, setCurrentRank] = useState<number | null>(null);

    useEffect(() => {
        async function fetchLeaders() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                // 1. Fetch Top 10
                const { data: topUsers } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'student')
                    .order('points', { ascending: false })
                    .limit(10);

                if (topUsers) setLeaders(topUsers);

                if (user) {
                    // 2. Fetch User Profile
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (profile) {
                        setCurrentUser(profile);

                        // 3. Calculate Rank (Count users with more points)
                        const { count } = await supabase
                            .from('profiles')
                            .select('id', { count: 'exact', head: true })
                            .eq('role', 'student')
                            .gt('points', profile.points || 0);

                        setCurrentRank((count || 0) + 1);
                    }
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchLeaders();
    }, []);

    if (loading) return <div className="text-center py-4 text-slate-400 font-bold italic">Loading leaderboard...</div>;

    const isUserInTop10 = leaders.some(l => l.id === currentUser?.id);

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex items-center justify-between mb-8 px-2">
                <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Leaderboard</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Global Rankings</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shadow-inner flex items-center justify-center overflow-visible">
                    <Trophy className="h-5 w-5" strokeWidth={2.5} />
                </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pb-20 no-scrollbar">
                {leaders.map((leader, index) => (
                    <LeaderItem
                        key={leader.id}
                        leader={leader}
                        index={index}
                        isMe={leader.id === currentUser?.id}
                    />
                ))}
                {leaders.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200 dark:text-slate-800">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-400 italic">Static observed. No signals yet.</p>
                    </div>
                )}
            </div>

            {/* Sticky Footer for My Rank (if not in top 10) */}
            {currentUser && !isUserInTop10 && currentRank && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 rounded-b-[32px]">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
                                {currentRank}
                            </div>
                            <div className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-wide">
                                Your Rank
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-black text-indigo-900 dark:text-white tabular-nums tracking-tighter">
                                {currentUser.points.toLocaleString()}
                            </div>
                            <div className="text-[7px] font-black text-indigo-400 uppercase tracking-widest">PTS</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
