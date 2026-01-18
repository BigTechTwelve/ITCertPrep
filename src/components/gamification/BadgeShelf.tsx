import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Trophy, BookOpen, PenTool, Brain, Lock, Medal } from 'lucide-react';

// Fallback types until supabase.ts is regenerated
interface Badge {
    id: string;
    name: string;
    description: string;
    icon_key: string;
    criteria_type: string;
    criteria_value: number;
    created_at: string;
}


interface ExtendedBadge extends Badge {
    earned: boolean;
    awarded_at?: string;
}

// Map icon strings to components
const IconMap: Record<string, any> = {
    'trophy': Trophy,
    'book-open': BookOpen,
    'pen-tool': PenTool,
    'brain': Brain,
    'medal': Medal,
    'library': BookOpen // Fallback/Variant
};

export default function BadgeShelf({ userId }: { userId: string }) {
    const [badges, setBadges] = useState<ExtendedBadge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBadges() {
            setLoading(true);

            // 1. Get all available badges
            const { data: allBadges } = await supabase
                .from('badges')
                .select('*')
                .order('criteria_value', { ascending: true });

            // 2. Get user's earned badges
            const { data: userBadges } = await supabase
                .from('user_badges')
                .select('badge_id, awarded_at')
                .eq('user_id', userId);

            if (allBadges) {
                const earnedMap = new Set(userBadges?.map(ub => ub.badge_id));
                const awardedAtMap = new Map(userBadges?.map(ub => [ub.badge_id, ub.awarded_at]));

                const processedBadges = allBadges.map(badge => ({
                    ...badge,
                    earned: earnedMap.has(badge.id),
                    awarded_at: awardedAtMap.get(badge.id) || undefined
                }));

                setBadges(processedBadges);
            }
            setLoading(false);
        }

        if (userId) fetchBadges();
    }, [userId]);

    if (loading) return <div className="text-center text-slate-400 py-4">Loading Badges...</div>;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-premium border border-white dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center">
                <Medal className="w-6 h-6 mr-3 text-yellow-500" />
                Achievements
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.map((badge) => {
                    const Icon = IconMap[badge.icon_key] || Trophy;

                    return (
                        <div
                            key={badge.id}
                            className={`
                                relative p-4 rounded-2xl border transition-all duration-300 group
                                ${badge.earned
                                    ? 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border-yellow-200 dark:border-yellow-700/30'
                                    : 'bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 opacity-60 hover:opacity-100'}
                            `}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm
                                    ${badge.earned
                                        ? 'bg-yellow-400 text-white shadow-yellow-200 dark:shadow-none'
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}
                                `}>
                                    {badge.earned ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                                </div>

                                <h4 className={`font-black text-sm mb-1 ${badge.earned ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                    {badge.name}
                                </h4>
                                <p className="text-[10px] font-medium text-slate-400 leading-tight px-2">
                                    {badge.description}
                                </p>

                                {badge.earned && (
                                    <div className="mt-2 text-[10px] font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider">
                                        Earned
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {badges.length === 0 && (
                <div className="text-center text-slate-400 italic py-4">No badges available.</div>
            )}
        </div>
    );
}
