import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { Clock, BookOpen, ChevronRight, Sparkles, Users, Zap } from 'lucide-react';
import Leaderboard from './Leaderboard';
import GameModeSelector from './GameModeSelector';
import PvPLobby from './PvPLobby';
import BadgeShelf from './BadgeShelf';
import { LevelService } from '../../lib/LevelService';
import SRSDueWidget from './SRSDueWidget';

type Certification = Database['public']['Tables']['certifications']['Row'];

function formatStudyTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

export default function StudentDashboard() {
    const [profile, setProfile] = useState<{ id: string } | null>(null);
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [points, setPoints] = useState(0);
    const [studyTime, setStudyTime] = useState(0);
    const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
    const [lastQuizId, setLastQuizId] = useState<string | null>(null);
    const [showPvPLobby, setShowPvPLobby] = useState(false);
    const navigate = useNavigate();

    // Level Calculations
    const level = LevelService.getLevel(points);
    const progress = LevelService.getProgress(points);
    const nextLevelXP = LevelService.getXPForNextLevel(level);
    const currentLevelBaseXP = LevelService.getXPForCurrentLevel(level);
    const xpInLevel = points - currentLevelBaseXP;
    const xpNeededForLevel = nextLevelXP - currentLevelBaseXP;

    const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('points, study_time_seconds')
                        .eq('id', user.id)
                        .single();

                    if (profile) {
                        setProfile({ id: user.id });
                        setPoints(profile.points || 0);
                        setStudyTime(profile.study_time_seconds || 0);
                    }

                    // Fetch enrolled classes
                    const { data: enrollments } = await supabase
                        .from('class_enrollments')
                        .select(`
                            *,
                            classes (
                                *,
                                pathways (*)
                            )
                        `)
                        .eq('student_id', user.id);

                    if (enrollments) setEnrolledClasses(enrollments);

                    // Fetch Last Quiz
                    const { data: lastSub } = await supabase
                        .from('quiz_submissions')
                        .select('quiz_id')
                        .eq('user_id', user.id)
                        .order('completed_at', { ascending: false })
                        .limit(1)
                        .single();

                    if (lastSub) setLastQuizId(lastSub.quiz_id);
                }

                const { data: certs } = await supabase
                    .from('certifications')
                    .select('*')
                    .limit(5);

                if (certs) setCertifications(certs);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleStartQuiz = (cert: Certification) => {
        setSelectedCert(cert);
    };

    const handleModeSelect = (mode: string) => {
        if (mode === 'pvp') {
            setShowPvPLobby(true);
            // Don't close selectedCert yet, keep GameModeSelector open under or replace it?
            // Better: Close GameSelector, open PvPLobby
            // But we need 'selectedCert' for PvPLobby
            return;
        }

        if (selectedCert) {
            navigate(`/quiz/${selectedCert.id}?mode=${mode}`);
        }
    };

    const handlePvPStart = (sessionId: string, playerId: string) => {
        if (selectedCert) {
            navigate(`/quiz/${selectedCert.id}?mode=pvp&sessionId=${sessionId}&playerId=${playerId}`);
        }
    };

    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinClassCode, setJoinClassCode] = useState('');
    const [joinError, setJoinError] = useState('');

    const handleJoinClass = async (e: React.FormEvent) => {
        e.preventDefault();
        setJoinError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Find Class
            const { data: classData, error: classError } = await supabase
                .from('classes')
                .select('id')
                .eq('code', joinClassCode.toUpperCase())
                .single();

            if (classError || !classData) {
                setJoinError('Invalid Class Code');
                return;
            }

            // 2. Enroll
            const { error: enrollError } = await supabase
                .from('class_enrollments')
                .insert({
                    class_id: classData.id,
                    student_id: user.id
                });

            if (enrollError) {
                if (enrollError.code === '23505') {
                    setJoinError('You are already enrolled in this class.');
                } else {
                    setJoinError(enrollError.message);
                }
                return;
            }

            // Success
            setShowJoinModal(false);
            setJoinClassCode('');
            alert('Successfully joined class!');
            // Ideally refresh headers or something, but dashboard doesn't show classes yet
            // Maybe redirect to class page or show a toast
        } catch (error: any) {
            setJoinError(error.message);
        }
    };

    return (
        <>
            <div className="space-y-10 pb-20 fade-in">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 p-8 md:p-12 shadow-2xl">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            Elevate your path <span className="text-primary-200">with CertFlow</span>
                        </h1>
                        <p className="text-lg text-primary-100 mb-8 font-medium leading-relaxed">
                            Track your progress, earn badges, and dominate the leaderboard. Pick a certification and start your journey today.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => lastQuizId ? navigate(`/quiz/q/${lastQuizId}`) : navigate('/certifications')}
                                className="px-6 py-3 bg-white text-primary-700 font-bold rounded-xl shadow-lg hover:bg-primary-50 transition-all flex items-center group"
                            >
                                {lastQuizId ? 'Continue Last Quiz' : 'Start New Quiz'}
                                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => certifications.length > 0 ? navigate(`/certification/${certifications[0].id}`) : navigate('/certifications')}
                                className="px-6 py-3 bg-primary-500/30 text-white border border-white/20 font-bold rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all"
                            >
                                View Study Guide
                            </button>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary-400 opacity-20 blur-3xl rounded-full"></div>
                    <div className="absolute bottom-0 right-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-indigo-400 opacity-10 blur-3xl rounded-full"></div>
                    <Sparkles className="absolute top-10 right-10 w-32 h-32 text-white/5 rotate-12" />
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Available Certs', value: certifications.length, icon: BookOpen, color: 'blue', bg: 'bg-blue-500', action: () => navigate('/certifications') },
                        {
                            type: 'level',
                            label: `Level ${level}`,
                            value: `${xpInLevel} / ${xpNeededForLevel} XP`,
                            icon: Zap,
                            color: 'amber',
                            bg: 'bg-amber-500',
                            progress: progress
                        },
                        { label: 'Study Hours', value: formatStudyTime(studyTime), icon: Clock, color: 'emerald', bg: 'bg-emerald-500' },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            onClick={() => (stat as any).action ? (stat as any).action() : null}
                            className={`group relative bg-[var(--bg-card)] p-6 rounded-[32px] border border-[var(--border-color)] shadow-premium interactive-card overflow-hidden ${(stat as any).action ? 'cursor-pointer hover:border-primary-500/50' : ''}`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`p-4 rounded-2xl ${stat.bg} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter tabular-nums">{stat.value}</p>
                                </div>
                            </div>
                            {/* Progress Bar for Level Card */}
                            {(stat as any).progress !== undefined && (
                                <div className="mt-4 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${(stat as any).progress}%` }}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Compact Action Bar */}
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => navigate('/flashcards')}
                        className="flex-1 md:flex-none px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all group flex items-center justify-center gap-3"
                    >
                        <Sparkles className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                        <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Flashcards</span>
                    </button>
                    <button
                        onClick={() => setShowJoinModal(true)}
                        className="flex-1 md:flex-none px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all group flex items-center justify-center gap-3"
                    >
                        <Users className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Join Class</span>
                    </button>
                </div>

                {/* SRS Review Alert */}
                <SRSDueWidget />

                {/* Grid 1: Certification Cards & Leaderboard */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-6 items-start">
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Active Certifications</h3>
                            <button className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">View All</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {loading ? (
                                <div className="col-span-2 p-12 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                                    Loading certifications...
                                </div>
                            ) : (
                                certifications.map((cert) => (
                                    <div
                                        key={cert.id}
                                        onClick={() => handleStartQuiz(cert)}
                                        className="group relative bg-[var(--bg-card)] p-6 rounded-[32px] border border-[var(--border-color)] shadow-premium interactive-card cursor-pointer flex flex-col justify-between"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-2 italic">{cert.provider}</p>
                                                <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors uppercase tracking-tight">
                                                    {cert.title}
                                                </h4>
                                            </div>
                                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
                                                <ChevronRight className="h-5 w-5" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <span>Progress</span>
                                                <span className="text-slate-900 dark:text-white">0%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary-600 rounded-full transition-all duration-1000" style={{ width: '0%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            {!loading && certifications.length === 0 && (
                                <div className="col-span-2 p-12 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                                    No certifications found.
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="lg:col-span-1 space-y-8 lg:mt-14">
                        {/* Leaderboard & Badges Container */}
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-12">
                            <section>
                                <Leaderboard />
                            </section>

                            <section>
                                <BadgeShelf userId={profile?.id || ''} />
                            </section>
                        </div>
                    </aside>
                </div>

                {/* Grid 2: My Classes (Aligned to Col 1-3) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 mt-12">
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">My Classes</h3>
                            <button
                                onClick={() => setShowJoinModal(true)}
                                className="text-sm font-black text-emerald-600 dark:text-emerald-400 hover:underline uppercase tracking-widest flex items-center gap-2"
                            >
                                <Users className="w-4 h-4" />
                                Join New Class
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledClasses.map((enrollment) => (
                                <div
                                    key={enrollment.class_id}
                                    onClick={() => navigate(`/class/${enrollment.class_id}`)}
                                    className="bg-white dark:bg-[var(--bg-card)] p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm interactive-card cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class</span>
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1 leading-tight">{enrollment.classes?.title}</h4>
                                    <p className="text-sm font-bold text-slate-400">{enrollment.classes?.pathways?.title || 'General Pathway'}</p>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-xs font-bold text-slate-500">
                                            Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {enrolledClasses.length === 0 && (
                                <div className="col-span-full p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-500 dark:text-slate-400 font-bold">You haven't joined any classes yet.</p>
                                    <button
                                        onClick={() => setShowJoinModal(true)}
                                        className="mt-2 text-primary-600 font-black hover:underline"
                                    >
                                        Join a Class
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {selectedCert && !showPvPLobby && (
                <GameModeSelector
                    certification={selectedCert}
                    onClose={() => setSelectedCert(null)}
                    onSelectMode={handleModeSelect}
                />
            )}

            {/* Join Class Modal */}
            {showJoinModal && (
                <div className="fixed z-[100] inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setShowJoinModal(false)}></div>
                    <div className="flex min-h-full p-4 sm:p-12 md:p-20">
                        <div className="relative m-auto bg-white dark:bg-[var(--bg-card)] rounded-[40px] px-8 pt-8 pb-8 text-left shadow-premium transform transition-all sm:max-w-md w-full border border-white dark:border-slate-800">
                            <div className="absolute top-0 right-0 pt-8 pr-8">
                                <button
                                    type="button"
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                    onClick={() => setShowJoinModal(false)}
                                >
                                    <span className="sr-only">Close</span>
                                    <span className="text-3xl font-light">&times;</span>
                                </button>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/20 mb-4">
                                    <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase" id="modal-title">Join Class</h3>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    Enter the 6-character code provided by your instructor.
                                </p>

                                {joinError && (
                                    <div className="mx-auto mt-4 max-w-xs bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-bold border border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/50">
                                        {joinError}
                                    </div>
                                )}

                                <form onSubmit={handleJoinClass} className="mt-6 space-y-4">
                                    <input
                                        type="text"
                                        required
                                        value={joinClassCode}
                                        onChange={(e) => setJoinClassCode(e.target.value.toUpperCase())}
                                        maxLength={6}
                                        className="block w-full text-center text-4xl font-mono font-black tracking-[0.5em] bg-slate-50 dark:bg-slate-950 border-none rounded-2xl py-6 focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white shadow-inner uppercase placeholder-slate-300 dark:placeholder-slate-800"
                                        placeholder="XXXXXX"
                                    />

                                    <button
                                        type="submit"
                                        disabled={!joinClassCode || joinClassCode.length < 6}
                                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl hover:shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        Join Class
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedCert && showPvPLobby && (
                <PvPLobby
                    certification={selectedCert}
                    onClose={() => {
                        setShowPvPLobby(false);
                        setSelectedCert(null);
                    }}
                    onGameStart={handlePvPStart}
                />
            )}
        </>
    );
}
