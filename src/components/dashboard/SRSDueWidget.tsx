import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Zap, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SRSDueWidget() {
    const [dueCount, setDueCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDueCount() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { count, error } = await supabase
                    .from('flashcard_reviews')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .lte('next_review_at', new Date().toISOString());

                if (error) throw error;
                setDueCount(count || 0);
            } catch (err) {
                console.error('Error fetching SRS count:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchDueCount();
    }, []);

    if (loading) return (
        <div className="h-32 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] animate-pulse flex items-center justify-center border border-slate-100 dark:border-slate-800">
            <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
        </div>
    );

    if (dueCount === 0) return null;

    return (
        <div
            onClick={() => navigate('/quiz/srs')}
            className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[32px] shadow-xl hover:shadow-orange-500/25 transition-all cursor-pointer interactive-card"
        >
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md shadow-lg group-hover:scale-110 transition-transform">
                        <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight uppercase">Knowledge Decay Alert</h3>
                        <p className="text-amber-100 font-bold">
                            <span className="text-white text-2xl tracking-tighter mr-1">{dueCount}</span> items are drifting from memory. Review them now to lock them in.
                        </p>
                    </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-orange-600 transition-all">
                    <ChevronRight className="h-6 w-6" />
                </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white opacity-10 blur-3xl rounded-full"></div>
            <Zap className="absolute -bottom-10 -left-10 w-48 h-48 text-white/5 -rotate-12" />
        </div>
    );
}
