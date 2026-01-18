import { useEffect, useState } from 'react';
import { Award, X } from 'lucide-react';
import type { Badge } from '../../lib/BadgeService';
import * as LucideIcons from 'lucide-react';

interface Props {
    badges: Badge[];
    onClose: () => void;
}

export default function BadgeNotification({ badges, onClose }: Props) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (badges.length > 0) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 500); // Wait for fade out
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [badges, onClose]);

    if (!isVisible && badges.length === 0) return null;

    return (
        <div className={`fixed bottom-4 right-4 z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border-l-4 border-yellow-400 p-4 max-w-sm w-full pointer-events-auto ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400 animate-bounce" />
                        </div>
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Badge Unlocked!
                        </p>
                        {badges.map((badge) => {
                            // Dynamic Icon
                            const IconComponent = (LucideIcons as any)[badge.icon] || Award;

                            return (
                                <div key={badge.id} className="mt-1">
                                    <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                                        <IconComponent className="h-3 w-3" />
                                        {badge.name}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                                        {badge.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            onClick={() => setIsVisible(false)}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
