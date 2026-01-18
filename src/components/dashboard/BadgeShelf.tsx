import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Award, Lock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Manually define until types are regenerated
interface BadgeRow {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    criteria?: any;
    created_at: string;
}

interface Props {
    userId?: string;
}

export default function BadgeShelf({ userId }: Props) {
    const [badges, setBadges] = useState<(BadgeRow & { earned: boolean, awarded_at?: string })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBadges() {
            let targetUserId = userId;
            if (!targetUserId) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                targetUserId = user.id;
            }

            // Get all badges
            const { data: allBadges } = await supabase.from('badges').select('*').order('name');

            // Get user badges
            const { data: userBadges } = await supabase
                .from('user_badges')
                .select('badge_id, awarded_at')
                .eq('user_id', targetUserId);

            const earnedMap = new Map();
            userBadges?.forEach(ub => earnedMap.set(ub.badge_id, ub.awarded_at));

            const castedBadges = (allBadges || []) as unknown as BadgeRow[];

            const combined = castedBadges.map(b => ({
                ...b,
                earned: earnedMap.has(b.id),
                awarded_at: earnedMap.get(b.id)
            }));

            // Sort: Earned first, then Alphabetical
            combined.sort((a, b) => {
                if (a.earned === b.earned) {
                    return a.name.localeCompare(b.name);
                }
                return a.earned ? -1 : 1;
            });

            setBadges(combined);
            setLoading(false);
        }
        fetchBadges();
    }, [userId]);

    if (loading) return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>;

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8 px-2">
                <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Achievements</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {badges.filter(b => b.earned).length} / {badges.length} Unlocked
                    </p>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-inner">
                    <Award className="h-5 w-5" />
                </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {badges.map((badge) => {
                    const IconComponent = (LucideIcons as any)[badge.icon] || Award;
                    return (
                        <div key={badge.id} className="group relative">
                            <div className={`
                                aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1 shadow-sm hover-scale
                                ${badge.earned
                                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-orange-500/20'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 grayscale opacity-40'}
                            `}>
                                {badge.earned ? <IconComponent className="h-6 w-6" /> : <Lock className="h-4 w-4" />}
                            </div>

                            {/* Tooltip - Premium Overhaul */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-3 bg-slate-900 dark:bg-black text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-64 z-[100] shadow-2xl translate-y-2 group-hover:translate-y-0 border border-white/10 backdrop-blur-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${badge.earned ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-500'}`}>
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div className="font-black text-xs uppercase tracking-widest">{badge.name}</div>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed mb-3 font-medium">{badge.description}</p>
                                <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-auto">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Status</span>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${badge.earned ? 'text-emerald-400' : 'text-rose-500/50'}`}>
                                        {badge.earned ? 'Unlocked' : 'Encrypted'}
                                    </span>
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900 dark:border-t-black"></div>
                            </div>
                        </div>
                    );
                })}

                {/* Visual Fillers for a sense of potential */}
                {Array.from({ length: Math.max(0, 10 - badges.length) }).map((_, i) => (
                    <div key={`filler-${i}`} className="aspect-square rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                    </div>
                ))}
            </div>

            {badges.length > 15 && (
                <button className="w-full mt-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    Expand Collection
                </button>
            )}
        </div>
    );
}
