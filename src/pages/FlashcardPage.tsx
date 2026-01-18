import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import { SRSAlgorithm, type SRSItem } from '../lib/SRSAlgorithm';
import type { Database } from '../types/supabase';
import { RotateCcw, Clock, ThumbsUp, Star, List, Play, ChevronRight } from 'lucide-react';
import FlashcardManager from '../components/flashcards/FlashcardManager';
import { BadgeService, type Badge } from '../lib/BadgeService';
import BadgeNotification from '../components/gamification/BadgeNotification';

type Flashcard = Database['public']['Tables']['flashcards']['Row'];
type Review = Database['public']['Tables']['flashcard_reviews']['Row'];

export default function FlashcardPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [queue, setQueue] = useState<(Flashcard & { review?: Review })[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sessionCount, setSessionCount] = useState(0);
    const [activeTab, setActiveTab] = useState<'review' | 'manage'>('review');
    const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);

    useEffect(() => {
        if (user) {
            supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => setProfile(data));
            fetchDueCards();
        }
    }, [user]);

    async function fetchDueCards() {
        if (!user) return;
        setLoading(true);

        try {
            const now = new Date().toISOString();
            const { data: reviews } = await supabase
                .from('flashcard_reviews')
                .select('*, flashcards(*)')
                .eq('user_id', user.id)
                .lte('next_review_at', now)
                .order('next_review_at', { ascending: true })
                .limit(20);

            let dueCards: (Flashcard & { review?: Review })[] = [];
            if (reviews) {
                dueCards = reviews.map((r: any) => ({
                    ...r.flashcards,
                    review: r
                }));
            }

            if (dueCards.length < 10) {
                const { data: allReviews } = await supabase
                    .from('flashcard_reviews')
                    .select('flashcard_id')
                    .eq('user_id', user.id);

                const reviewedIds = allReviews?.map(r => r.flashcard_id) || [];

                let query = supabase
                    .from('flashcards')
                    .select('*')
                    .eq('user_id', user.id)
                    .limit(10 - dueCards.length);

                if (reviewedIds.length > 0) {
                    query = query.not('id', 'in', `(${reviewedIds.join(',')})`);
                }

                const { data: newCards } = await query;

                if (newCards) {
                    dueCards = [...dueCards, ...newCards];
                }
            }

            setQueue(dueCards);
        } catch (error) {
            console.error("Error fetching flashcards:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleRate = async (quality: number) => {
        if (!user) return;
        const currentCard = queue[currentCardIndex];

        const previousItem: SRSItem = currentCard.review
            ? {
                interval: currentCard.review.interval,
                repetition: currentCard.review.repetition,
                ef_factor: currentCard.review.ef_factor
            }
            : { interval: 0, repetition: 0, ef_factor: 2.5 };

        const newItem = SRSAlgorithm.calculate(quality, previousItem);
        const nextReview = SRSAlgorithm.getNextReviewDate(newItem.interval).toISOString();

        if (currentCard.review) {
            await supabase
                .from('flashcard_reviews')
                .update({
                    next_review_at: nextReview,
                    interval: newItem.interval,
                    repetition: newItem.repetition,
                    ef_factor: newItem.ef_factor,
                    last_reviewed_at: new Date().toISOString()
                })
                .eq('id', currentCard.review.id);
        } else {
            await supabase
                .from('flashcard_reviews')
                .insert({
                    user_id: user.id,
                    flashcard_id: currentCard.id,
                    next_review_at: nextReview,
                    interval: newItem.interval,
                    repetition: newItem.repetition,
                    ef_factor: newItem.ef_factor
                });
        }

        if (currentCardIndex < queue.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
            setIsFlipped(false);
            setSessionCount(prev => prev + 1);
        } else {
            setSessionCount(prev => prev + 1);
            setQueue([]);
        }
    };

    const handleRateWithGamification = async (quality: number) => {
        await handleRate(quality);
        if (!user || !profile) return;

        try {
            const newPoints = (profile.points || 0) + 5;
            const newStudyTime = (profile.study_time_seconds || 0) + 30;

            setProfile({ ...profile, points: newPoints, study_time_seconds: newStudyTime });

            await supabase
                .from('profiles')
                .update({
                    points: newPoints,
                    study_time_seconds: newStudyTime
                })
                .eq('id', user.id);

            const newBadges = await BadgeService.checkAndAwardBadges(user.id);

            if (newBadges.length > 0) {
                setEarnedBadges(prev => [...prev, ...newBadges]);
            }

        } catch (error) {
            console.error('Gamification Error:', error);
        }
    };

    // Keyboard Shortcuts
    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (activeTab !== 'review' || !queue[currentCardIndex]) return;

        if (event.code === 'Space') {
            event.preventDefault();
            if (!isFlipped) setIsFlipped(true);
        } else if (isFlipped) {
            switch (event.key) {
                case '1': handleRateWithGamification(1); break;
                case '3': handleRateWithGamification(3); break;
                case '4': handleRateWithGamification(4); break;
                case '5': handleRateWithGamification(5); break;
            }
        }
    }, [activeTab, queue, currentCardIndex, isFlipped]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    if (loading) return <div className="h-screen flex items-center justify-center text-slate-400 font-medium">Loading deck...</div>;

    const currentCard = queue[currentCardIndex];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20 relative overflow-hidden">
            <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-500/5 blur-[120px] rounded-full"></div>
            <Navbar profile={profile} />
            <BadgeNotification badges={earnedBadges} onClose={() => setEarnedBadges([])} />

            <div className="max-w-4xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-24 relative z-10 w-full perspective-1000">
                {/* Header & Tabs */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                            Study <span className="text-primary-600 dark:text-primary-400">Center</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium italic">Master your material with Spaced Repetition.</p>
                    </div>

                    <div className="flex p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-premium">
                        <button
                            onClick={() => setActiveTab('review')}
                            className={`flex items-center px-8 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'review'
                                ? 'bg-primary-600 text-white shadow-lg scale-105'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            <Play className="w-4 h-4 mr-2" />
                            Review
                        </button>
                        <button
                            onClick={() => setActiveTab('manage')}
                            className={`flex items-center px-8 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'manage'
                                ? 'bg-primary-600 text-white shadow-lg scale-105'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            <List className="w-4 h-4 mr-2" />
                            Manage
                        </button>
                    </div>
                </div>

                {activeTab === 'manage' ? (
                    <FlashcardManager userId={user?.id || ''} />
                ) : (
                    <>
                        {currentCard && (
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="p-1 px-2 border border-slate-200 dark:border-slate-800 rounded">Space</span>
                                    <span>to flip</span>
                                </div>
                                <span>Session: {sessionCount}</span>
                            </div>
                        )}

                        {!currentCard ? (
                            <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-premium p-20 text-center border border-white dark:border-slate-800 fade-in">
                                <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <ThumbsUp className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Review Complete</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mb-12 max-w-sm mx-auto">
                                    You've processed all your due cards for today. Great job staying on track!
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-xl hover:shadow-primary-500/25 transition-all active:scale-95"
                                >
                                    Refresh Queue
                                </button>
                            </div>
                        ) : (
                            <div className="max-w-2xl mx-auto relative h-[450px]">
                                {/* Card Container with 3D Transform */}
                                <div
                                    onClick={() => !isFlipped && setIsFlipped(true)}
                                    className={`relative w-full h-full transition-all duration-500 cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Front */}
                                    <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 rounded-[40px] shadow-premium border-2 border-white dark:border-slate-800 p-12 flex flex-col items-center justify-center">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                        <span className="text-[10px] font-black tracking-[0.3em] uppercase mb-10 text-slate-400">
                                            QUESTION PROMPT
                                        </span>
                                        <p className="text-3xl md:text-4xl text-center font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                                            {currentCard.front}
                                        </p>
                                        <div className="mt-16 flex items-center text-primary-500 font-black text-xs uppercase tracking-widest animate-pulse">
                                            Tap or Space to Flip <ChevronRight className="ml-2 w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Back */}
                                    <div
                                        className="absolute inset-0 backface-hidden bg-slate-900 border-2 border-primary-500 shadow-[0_0_30px_rgba(99,102,241,0.2)] rounded-[40px] p-12 flex flex-col items-center justify-center"
                                        style={{ transform: 'rotateY(180deg)' }}
                                    >
                                        <span className="text-[10px] font-black tracking-[0.3em] uppercase mb-10 text-primary-400">
                                            REVEALED ANSWER
                                        </span>
                                        <p className="text-3xl md:text-4xl text-center font-black leading-tight tracking-tight text-white">
                                            {currentCard.back}
                                        </p>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className={`absolute -bottom-24 left-0 right-0 grid grid-cols-4 gap-4 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                                    {[
                                        { q: 1, label: 'Again', dur: '< 1 min', icon: RotateCcw, color: 'rose', key: '1' },
                                        { q: 3, label: 'Hard', dur: '2 days', icon: Clock, color: 'amber', key: '3' },
                                        { q: 4, label: 'Good', dur: '4 days', icon: ThumbsUp, color: 'primary', key: '4' },
                                        { q: 5, label: 'Easy', dur: '7 days', icon: Star, color: 'emerald', key: '5' },
                                    ].map((btn) => {
                                        const colors = {
                                            rose: 'bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/20',
                                            amber: 'bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20',
                                            primary: 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/20',
                                            emerald: 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/20',
                                        };
                                        return (
                                            <button
                                                key={btn.label}
                                                onClick={() => handleRateWithGamification(btn.q)}
                                                className={`relative flex flex-col items-center justify-center p-4 rounded-3xl transition-all group border-none shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95 ${colors[btn.color as keyof typeof colors]}`}
                                            >
                                                <div className="absolute top-2 right-3 text-[10px] font-bold opacity-30 border border-current px-1.5 rounded">
                                                    {btn.key}
                                                </div>
                                                <btn.icon className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span>
                                                <span className="text-[8px] font-bold opacity-60 mt-0.5">{btn.dur}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
