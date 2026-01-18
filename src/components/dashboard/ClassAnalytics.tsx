
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import WeaknessHeatmap from '../../components/analytics/WeaknessHeatmap';
import EngagementHeatmap from '../../components/analytics/EngagementHeatmap';
import { BarChart3, RefreshCw, Activity } from 'lucide-react';

interface Props {
    classId: string;
}

export default function ClassAnalytics({ classId }: Props) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [classId]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const { data: analytics, error } = await supabase.rpc('get_class_weaknesses', { p_class_id: classId });
            if (error) throw error;
            if (analytics) setData(analytics);
        } catch (err) {
            console.error('Error loading analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 shadow-premium rounded-[40px] border border-white dark:border-slate-800 overflow-hidden fade-in">
            <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-500" />
                        Weakness Heatmap
                    </h3>
                    <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                        Identify topics where your students are struggling
                    </p>
                </div>
                <button
                    onClick={fetchAnalytics}
                    className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="p-10 bg-slate-50/30 dark:bg-slate-950/30 space-y-10">
                <EngagementHeatmap classId={classId} />

                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Objective Mastery Heatmap</h4>
                    </div>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
                            <p className="font-bold">Analyzing student performance...</p>
                        </div>
                    ) : (
                        <WeaknessHeatmap data={data} />
                    )}
                </div>
            </div>
        </div>
    );
}
