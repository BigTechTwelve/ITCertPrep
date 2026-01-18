import { Flame, Star } from 'lucide-react';

interface Props {
    streak: number;
    onClose: () => void;
}

export default function StreakCelebration({ streak, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500">
            <div className="max-w-md w-full glass-card p-12 rounded-[48px] shadow-2xl border border-white/20 text-center relative overflow-hidden animate-in zoom-in-95 duration-500 delay-150">
                {/* Background Sparkles */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <Star className="absolute top-10 left-10 text-amber-400 animate-pulse" size={24} />
                    <Star className="absolute bottom-10 right-10 text-amber-400 animate-pulse delay-700" size={16} />
                    <Star className="absolute top-20 right-20 text-amber-400 animate-pulse delay-300" size={20} />
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-[40px] bg-gradient-to-br from-orange-500 to-rose-600 shadow-2xl mb-10 animate-bounce">
                        <Flame className="h-16 w-16 text-white" />
                    </div>

                    <h2 className="text-5xl font-black text-white tracking-tighter mb-4">
                        {streak} DAY STREAK!
                    </h2>

                    <p className="text-rose-100 font-bold text-lg mb-10 leading-relaxed uppercase tracking-wider">
                        You're on fire! Keep this momentum and master your certification.
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full py-5 bg-white text-rose-600 font-black rounded-3xl shadow-xl hover:shadow-white/25 active:scale-95 transition-all text-xl uppercase tracking-tighter"
                    >
                        Forward to Mastery
                    </button>
                </div>

                {/* Decorative Bottom Flame */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/20 blur-[80px] rounded-full"></div>
            </div>
        </div>
    );
}
