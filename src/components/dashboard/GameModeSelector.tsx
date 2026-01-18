import { X, Clock, Zap, Skull, Users } from 'lucide-react';
import type { Database } from '../../types/supabase';

type Certification = Database['public']['Tables']['certifications']['Row'];

interface Props {
    certification: Certification;
    onClose: () => void;
    onSelectMode: (mode: 'standard' | 'time_attack' | 'sudden_death' | 'pvp') => void;
}

export default function GameModeSelector({ certification, onClose, onSelectMode }: Props) {
    const modes: {
        id: 'standard' | 'time_attack' | 'sudden_death' | 'pvp';
        title: string;
        description: string;
        icon: React.ElementType;
        color: string;
        hover: string;
        disabled?: boolean;
    }[] = [
            {
                id: 'standard',
                title: 'Standard',
                description: 'Casual study mode. No timer, instant feedback.',
                icon: Zap,
                color: 'bg-blue-100 text-blue-600',
                hover: 'hover:border-blue-500 hover:shadow-blue-100'
            },
            {
                id: 'time_attack',
                title: 'Time Attack',
                description: 'Start with 60s. Correct answers add time!',
                icon: Clock,
                color: 'bg-yellow-100 text-yellow-600',
                hover: 'hover:border-yellow-500 hover:shadow-yellow-100'
            },
            {
                id: 'sudden_death',
                title: 'Sudden Death',
                description: 'One strike and you are out. How far can you go?',
                icon: Skull,
                color: 'bg-red-100 text-red-600',
                hover: 'hover:border-red-500 hover:shadow-red-100'
            },
            {
                id: 'pvp',
                title: 'Head-to-Head',
                description: 'Challenge another student in real-time.',
                icon: Users,
                color: 'bg-purple-100 text-purple-600',
                hover: 'hover:border-purple-500 hover:shadow-purple-100',
                disabled: false
            }
        ];

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-2xl sm:w-full sm:p-6">
                    <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                        <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="sm:flex sm:items-start w-full">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                            <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-2" id="modal-title">
                                {certification.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Select a game mode to test your knowledge.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {modes.map((mode) => (
                                    <button
                                        key={mode.id}
                                        onClick={() => !mode.disabled && onSelectMode(mode.id)}
                                        disabled={mode.disabled}
                                        className={`relative rounded-lg border-2 border-gray-200 p-6 flex flex-col items-center text-center space-y-3 transition-all duration-200 ${mode.disabled ? 'opacity-50 cursor-not-allowed text-gray-400' : `bg-white cursor-pointer ${mode.hover}`}`}
                                    >
                                        <div className={`p-4 rounded-full ${mode.color}`}>
                                            <mode.icon className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900">{mode.title}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{mode.description}</p>
                                        </div>
                                        {mode.disabled && (
                                            <span className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                Coming Soon
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
