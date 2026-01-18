import { useEffect, useState } from 'react';
import { Award, X } from 'lucide-react';
import type { Badge } from '../../lib/BadgeService';
import * as LucideIcons from 'lucide-react';

interface Props {
    badge: Badge;
    onClose: () => void;
}

export default function BadgeUnlockOverlay({ badge, onClose }: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Function to handle close with exit animation
    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade out
    };

    const IconComponent = (LucideIcons as any)[badge.icon] || Award;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${visible ? 'bg-slate-900/80 backdrop-blur-md' : 'bg-transparent pointer-events-none opacity-0'}`}>
            {/* Background effects */}
            <div className={`absolute inset-0 overflow-hidden ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/20 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className={`
                relative w-full max-w-md p-8 rounded-[40px] bg-white dark:bg-slate-900 border border-white/20 shadow-2xl text-center transform transition-all duration-500
                ${visible ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-20 opacity-0'}
            `}>
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6 inline-flex items-center justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-50 animate-pulse"></div>
                        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-300 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/30">
                            <IconComponent className="w-12 h-12" />
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">New!</span>
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Badge Unlocked!</h2>
                <div className="h-1 w-12 bg-amber-500 mx-auto rounded-full mb-6"></div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{badge.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        {badge.description}
                    </p>
                </div>

                <button
                    onClick={handleClose}
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-sm uppercase tracking-widest"
                >
                    Awesome
                </button>
            </div>

            {/* Confetti (Simple CSS placeholders) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                {/* We could add actual canvas confetti here later, for now just the modal is enough upgrade */}
            </div>
        </div>
    );
}
