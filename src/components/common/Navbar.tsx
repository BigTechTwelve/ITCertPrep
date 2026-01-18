import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import type { Database } from '../../types/supabase';
import { Sparkles, Trophy } from 'lucide-react';
import NotificationBell from './NotificationBell';
import UserAvatar from './UserAvatar';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface NavbarProps {
    profile: Profile | null;
}

export default function Navbar({ profile }: NavbarProps) {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center space-x-2 group">
                            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                                <img src="/favicon.png" alt="CertFlow Logo" className="w-6 h-6 object-contain" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                                Cert<span className="text-primary-600 dark:text-primary-400">Flow</span>
                            </span>
                        </Link>
                    </div>

                    {/* Nav Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
                        <Link to="/certifications" className="px-3 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Certifications</Link>
                        <Link to="/flashcards" className="px-3 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center">
                            <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
                            Flashcards
                        </Link>
                        <Link to="/leaderboard" className="px-3 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center">
                            <Trophy className="w-4 h-4 mr-1.5 text-amber-500" />
                            Leaderboard
                        </Link>
                    </div>

                    {/* Right Tools */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <ThemeToggle />
                        <NotificationBell />

                        {/* User Pill */}
                        <div
                            className="flex items-center space-x-3 pl-3 pr-1 py-1 rounded-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary-400 transition-all cursor-pointer group"
                            onClick={() => navigate('/profile')}
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-gray-900 dark:text-white leading-tight">
                                    {profile?.full_name || user?.email?.split('@')[0]}
                                </p>
                                <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-tighter">
                                    {profile?.points || 0} PTS
                                </p>
                            </div>
                            <UserAvatar
                                avatarUrl={profile?.avatar_url}
                                fullName={profile?.full_name}
                                email={user?.email}
                                size="sm"
                                className="group-hover:ring-2 ring-primary-400 transition-all"
                            />
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                            title="Sign Out"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
