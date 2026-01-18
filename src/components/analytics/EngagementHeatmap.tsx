import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { TrendingUp } from 'lucide-react';

interface Props {
    classId: string;
}

export default function EngagementHeatmap({ classId }: Props) {
    const [dailySeconds, setDailySeconds] = useState<number[]>(new Array(7).fill(0));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEngagement() {
            try {
                // 1. Get student IDs in class
                const { data: students } = await supabase
                    .from('class_enrollments')
                    .select('student_id')
                    .eq('class_id', classId);

                if (!students || students.length === 0) {
                    setLoading(false);
                    return;
                }

                const sIds = students.map(s => s.student_id);

                // 2. Get sessions for these students from last 7 days
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const { data: sessions, error } = await supabase
                    .from('user_sessions')
                    .select('started_at, total_seconds')
                    .in('user_id', sIds)
                    .gte('started_at', sevenDaysAgo.toISOString());

                if (error) throw error;

                if (sessions) {
                    const days = new Array(7).fill(0);
                    const now = new Date();
                    sessions.forEach(s => {
                        const sDate = new Date(s.started_at);
                        const diffDays = Math.floor((now.getTime() - sDate.getTime()) / (1000 * 3600 * 24));
                        if (diffDays >= 0 && diffDays < 7) {
                            days[6 - diffDays] += (s.total_seconds || 0);
                        }
                    });
                    setDailySeconds(days);
                }
            } catch (err) {
                console.error("Engagement Error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchEngagement();
    }, [classId]);

    const maxSeconds = Math.max(...dailySeconds, 1);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = new Date().getDay();
    const last7Days = Array.from({ length: 7 }, (_, i) => dayNames[(currentDay - 6 + i + 7) % 7]);

    if (loading) return <div className="h-48 flex items-center justify-center text-slate-400 font-bold">Loading engagement...</div>;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        Class Activity (Last 7 Days)
                    </h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Aggregate Daily Study Time</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {Math.round(dailySeconds.reduce((a, b) => a + b, 0) / 60)}m
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total this week</span>
                </div>
            </div>

            <div className="flex items-end justify-between gap-2 h-40">
                {dailySeconds.map((seconds, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                        <div className="relative w-full">
                            {/* Bar */}
                            <div
                                className="w-full bg-slate-50 dark:bg-slate-800 rounded-t-xl overflow-hidden min-h-[4px]"
                                style={{ height: `${(seconds / maxSeconds) * 100}%` }}
                            >
                                <div className="h-full bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-emerald-500 group-hover:to-emerald-300 transition-all rounded-t-xl" />
                            </div>

                            {/* Value Tooltip */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {Math.round(seconds / 60)}m
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{last7Days[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
