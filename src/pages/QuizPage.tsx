
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import QuestionCard from '../components/quiz/QuestionCard';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { BadgeService, type Badge } from '../lib/BadgeService';
import BadgeUnlockOverlay from '../components/gamification/BadgeUnlockOverlay';
import AIQuizGenerator from '../components/quiz/AIQuizGenerator';
import ObjectiveSelector from '../components/quiz/ObjectiveSelector';
import type { GeneratedQuestion } from '../lib/GeminiService';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../contexts/AuthContext';
import PvPGame from '../components/dashboard/PvPGame';
import { SRSAlgorithm } from '../lib/SRSAlgorithm';
import StreakCelebration from '../components/gamification/StreakCelebration';
import { useSettings } from '../hooks/useSettings';

type Question = Database['public']['Tables']['questions']['Row'] & {
    answers: Database['public']['Tables']['answers']['Row'][];
};

interface GameScores {
    p1: number;
    p2: number;
}

export default function QuizPage() {
    const { certificationId, quizId } = useParams<{ certificationId: string; quizId: string }>();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'standard';
    const sessionId = searchParams.get('sessionId');
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
    const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<Set<string>>(new Set());
    const [userAnswers, setUserAnswers] = useState<Record<string, { answerId: string, isCorrect: boolean }>>({});
    const startTimeRef = useRef(Date.now());
    const sessionIdRef = useRef<string | null>(null);

    // Game Mode State
    const [timeLeft, setTimeLeft] = useState(60); // 60s start for time attack
    const [gameOver, setGameOver] = useState(false);

    // PvP State
    const [opponentScore, setOpponentScore] = useState(0);
    const [isPlayer1, setIsPlayer1] = useState<boolean | null>(null);

    // Objective Selector State
    const [showObjectiveSelector, setShowObjectiveSelector] = useState(false);
    const [selectedObjectiveIds, setSelectedObjectiveIds] = useState<string[] | null>(null);

    // AI Mode State
    const [showAI, setShowAI] = useState(certificationId === 'ai');
    const [showStreakCelebration, setShowStreakCelebration] = useState<number | null>(null);
    const { settings, loading: settingsLoading } = useSettings();

    // Auth & Profile
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null); // Quick fix for profile type to avoid full import refactor right now

    useEffect(() => {
        if (!settingsLoading && certificationId === 'ai') {
            if (!settings.ai_enabled) {
                navigate('/dashboard');
                return;
            }
            setShowAI(true);
            setLoading(false);
        }
    }, [certificationId, settings.ai_enabled, settingsLoading, navigate]);

    useEffect(() => {
        if (user) {
            supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => setProfile(data));

            // Start Activity Session
            const startSession = async () => {
                const { data, error } = await supabase
                    .from('user_sessions')
                    .insert({ user_id: user.id })
                    .select()
                    .single();
                if (!error && data) {
                    sessionIdRef.current = data.id;
                }
            };
            startSession();

            return () => {
                // End Session on Cleanup
                if (sessionIdRef.current) {
                    const endTime = new Date();
                    const duration = Math.floor((endTime.getTime() - startTimeRef.current) / 1000);
                    supabase
                        .from('user_sessions')
                        .update({
                            ended_at: endTime.toISOString(),
                            total_seconds: duration
                        })
                        .eq('id', sessionIdRef.current)
                        .then();
                }
            };
        }
    }, [user]);

    // Fetch Specific Quiz
    useEffect(() => {
        async function fetchQuiz() {
            if (!quizId) return;
            setLoading(true);
            try {
                // 2. Get Questions
                const { data: quizQuestions, error } = await supabase
                    .from('quiz_questions')
                    .select(`
                        order,
                        question:questions (
                            *,
                            answers (*)
                        )
                    `)
                    .eq('quiz_id', quizId)
                    .order('order', { ascending: true });

                if (error) throw error;

                if (quizQuestions) {
                    // Map nested question object to flat list
                    const formattedQuestions = quizQuestions.map((q: any) => q.question);
                    setQuestions(formattedQuestions);
                }
            } catch (err) {
                console.error("Error loading quiz:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchQuiz();
    }, [quizId]);

    // Initial PvP Setup
    useEffect(() => {
        async function setupPvP() {
            if (mode === 'pvp' && sessionId) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: session } = await supabase
                    .from('game_sessions')
                    .select('player_1_id, scores')
                    .eq('id', sessionId)
                    .single();

                if (session) {
                    const isP1 = session.player_1_id === user.id;
                    setIsPlayer1(isP1);

                    // Set initial opponent score
                    const scores = session.scores as unknown as GameScores;
                    setOpponentScore(isP1 ? scores.p2 : scores.p1);

                    // Subscribe to changes
                    const channel = supabase
                        .channel(`game:${sessionId}`)
                        .on(
                            'postgres_changes',
                            { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${sessionId}` },
                            (payload) => {
                                const newSession = payload.new as { scores: GameScores }; // Type assertion for payload
                                const newScores = newSession.scores;
                                setOpponentScore(isP1 ? newScores.p2 : newScores.p1);
                            }
                        )
                        .subscribe();

                    return () => {
                        supabase.removeChannel(channel);
                    };
                }
            }
        }
        setupPvP();
    }, [mode, sessionId]);

    // Timer Logic


    // Initialize Timer
    useEffect(() => {
        if (mode === 'mock_exam' || mode === 'exam') {
            setTimeLeft(90 * 60);
        } else if (mode === 'time_attack') {
            setTimeLeft(60);
        }
    }, [mode]);

    useEffect(() => {
        if ((mode === 'time_attack' || mode === 'mock_exam' || mode === 'exam') && !gameOver && !loading) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setGameOver(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [mode, gameOver, loading]);

    useEffect(() => {
        async function fetchQuestions() {
            if (!certificationId || certificationId === 'ai') return; // Skip if AI or no cert

            try {
                let targetObjectiveIds: string[] = [];
                const objectiveParam = searchParams.get('objective');

                if (selectedObjectiveIds && selectedObjectiveIds.length > 0) {
                    targetObjectiveIds = selectedObjectiveIds;
                } else if (objectiveParam) {
                    targetObjectiveIds = [objectiveParam];
                } else {
                    // 1. Get all objectives for this cert
                    const { data: objectives } = await supabase
                        .from('objectives')
                        .select('id')
                        .eq('certification_id', certificationId);

                    if (!objectives?.length) return;
                    targetObjectiveIds = objectives.map(obj => obj.id);
                }

                // 2. Get RANDOM questions using RPC
                // We use the RPC to get randomized questions + answers efficiently
                const { data, error } = await supabase
                    .rpc('get_random_questions', {
                        p_objective_ids: targetObjectiveIds,
                        p_limit: 10 // Still limit 10 for standard mode, can increase for mock exams
                    });

                if (error) {
                    console.error('Error fetching questions:', error);
                    return;
                }

                if (data) {
                    // 3. Transform flat RPC data back into Question + Answers structure
                    // The RPC returns one row per answer (joined), so we need to group them.
                    const questionsMap = new Map<string, Question>();

                    data.forEach((row: any) => {
                        if (!questionsMap.has(row.id)) {
                            questionsMap.set(row.id, {
                                id: row.id,
                                objective_id: row.objective_id,
                                text: row.text,
                                type: row.type as any,
                                points: row.points,
                                created_at: row.created_at,
                                explanation: row.explanation, // Capture explanation
                                answers: []
                            });
                        }

                        const question = questionsMap.get(row.id)!;
                        question.answers.push({
                            id: row.answer_id,
                            question_id: row.id,
                            text: row.answer_text,
                            is_correct: row.answer_is_correct,
                            created_at: new Date().toISOString() // RPC might not return this, mock it or fetch if needed
                        });
                    });

                    // Convert map values to array
                    let formattedQuestions = Array.from(questionsMap.values());

                    // --- Intelligent SRS Injection ---
                    if (mode === 'standard' || mode === 'practice') {
                        try {
                            const { data: { user } } = await supabase.auth.getUser();
                            if (user) {
                                const { data: srsReviews } = await supabase
                                    .from('flashcard_reviews')
                                    .select(`
                                        *,
                                        flashcard:flashcards (
                                            question_id,
                                            question:questions (
                                                *,
                                                answers (*)
                                            )
                                        )
                                    `)
                                    .eq('user_id', user.id)
                                    .lte('next_review_at', new Date().toISOString())
                                    .limit(2); // Inject up to 2 review cards

                                if (srsReviews && srsReviews.length > 0) {
                                    const srsQuestions = srsReviews
                                        .filter((r: any) => r.flashcard?.question)
                                        .map((r: any) => ({
                                            ...r.flashcard.question,
                                            review_id: r.id,
                                            is_srs_injection: true,
                                            srs_data: {
                                                interval: r.interval,
                                                repetition: r.repetition,
                                                ef_factor: r.ef_factor
                                            }
                                        }));

                                    // Append and shuffle
                                    formattedQuestions = [...formattedQuestions, ...srsQuestions];
                                }
                            }
                        } catch (srsErr) {
                            console.error("SRS Injection failed:", srsErr);
                        }
                    }
                    // ---------------------------------

                    // Shuffle answers for extra randomness? (Optional, but good practice)
                    formattedQuestions.forEach(q => {
                        q.answers.sort(() => Math.random() - 0.5);
                    });

                    setQuestions(formattedQuestions.sort(() => Math.random() - 0.5));
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }

        async function fetchSRSQuestions() {
            if (mode !== 'srs') return;
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: reviews, error } = await supabase
                    .from('flashcard_reviews')
                    .select(`
                        *,
                        flashcard:flashcards (
                            question_id,
                            question:questions (
                                *,
                                answers (*)
                            )
                        )
                    `)
                    .eq('user_id', user.id)
                    .lte('next_review_at', new Date().toISOString())
                    .limit(20);

                if (error) throw error;

                if (reviews) {
                    const formattedQuestions = reviews
                        .filter((r: any) => r.flashcard?.question)
                        .map((r: any) => ({
                            ...r.flashcard.question,
                            review_id: r.id,
                            srs_data: {
                                interval: r.interval,
                                repetition: r.repetition,
                                ef_factor: r.ef_factor
                            }
                        }));
                    setQuestions(formattedQuestions);
                }
            } catch (err) {
                console.error("SRS Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        }

        if (mode === 'srs') fetchSRSQuestions();
        else fetchQuestions();
    }, [certificationId, mode, searchParams, selectedObjectiveIds]);

    const handleAnswer = async (answerId: string) => {
        if (gameOver) return;
        setSelectedAnswerId(answerId);

        // For Mock Exam, we don't show immediate results or lock the answer.
        // Grading happens when moving to next question (or at end, but per-question is easier for current architecture).
        if (mode === 'mock_exam' || mode === 'exam') {
            return;
        }

        setIsAnswered(true);
        processScore(answerId);
    };

    const processScore = async (answerId: string) => {
        const question = questions[currentQuestionIndex];
        const answer = question.answers.find(a => a.id === answerId);
        const isCorrect = answer?.is_correct || false;

        let newScore = score;

        if (isCorrect) {
            newScore = score + (question.points || 0);
            setScore(newScore);
            if (mode === 'time_attack') {
                setTimeLeft(t => t + 10);
            }
            saveProgress(question, answerId, true);
        } else {
            if (mode === 'time_attack') {
                setTimeLeft(t => Math.max(0, t - 5));
            } else if (mode === 'sudden_death') {
                setGameOver(true);
            }
            saveProgress(question, answerId, false);
        }

        // Track answer for final submission
        setUserAnswers(prev => ({
            ...prev,
            [question.id]: { answerId, isCorrect }
        }));

        // Update SRS Stats if it's an SRS question (direct or injected)
        if ((question as any).review_id) {
            const quality = isCorrect ? 5 : 1;
            const nextSRS = SRSAlgorithm.calculate(quality, (question as any).srs_data);

            await supabase
                .from('flashcard_reviews')
                .update({
                    interval: nextSRS.interval,
                    repetition: nextSRS.repetition,
                    ef_factor: nextSRS.ef_factor,
                    next_review_at: SRSAlgorithm.getNextReviewDate(nextSRS.interval).toISOString(),
                    last_reviewed_at: new Date().toISOString()
                })
                .eq('id', (question as any).review_id);
        }

        updatePvPScore(newScore);
    };

    const updatePvPScore = async (newScore: number) => {
        // Update PvP Score
        if (mode === 'pvp' && sessionId && isPlayer1 !== null) {
            const { data: session } = await supabase
                .from('game_sessions')
                .select('scores')
                .eq('id', sessionId)
                .single();

            if (session) {
                const currentScores = session.scores as unknown as GameScores;
                const updatedScores = {
                    ...currentScores,
                    [isPlayer1 ? 'p1' : 'p2']: newScore
                };

                await supabase
                    .from('game_sessions')
                    .update({ scores: updatedScores })
                    .eq('id', sessionId);
            }
        }
    };

    const saveProgress = async (question: Question, _answerId: string, isCorrect: boolean) => {
        try {
            const { error: progressError } = await supabase
                .from('user_progress')
                .insert({
                    user_id: (await supabase.auth.getUser()).data.user?.id!,
                    question_id: question.id,
                    is_correct: isCorrect
                });

            if (progressError) console.error('Error saving progress:', progressError);

            if (isCorrect) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('points')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    await supabase
                        .from('profiles')
                        .update({ points: (profile.points || 0) + (question.points || 0) })
                        .eq('id', user.id);
                }
            }
        } catch (err) {
            console.error('Failed to save score:', err);
        }
    };

    const handleBookmark = async () => {
        if (!user) return;
        const currentQuestion = questions[currentQuestionIndex];

        // Toggle (Currently only implementing Add for simplicity, can add Remove logic later)
        if (bookmarkedQuestionIds.has(currentQuestion.id)) return;

        try {
            // Find correct answer
            const correctlyAnswer = currentQuestion.answers.find(a => a.is_correct);
            if (!correctlyAnswer) return;

            // Save to Flashcards
            const { data: flashcard, error } = await supabase
                .from('flashcards')
                .insert({
                    user_id: user.id,
                    question_id: currentQuestion.id,
                    front: currentQuestion.text,
                    back: correctlyAnswer.text
                })
                .select()
                .single();

            if (error) throw error;

            if (flashcard) {
                // Initialize SRS Review entry
                const { error: srsError } = await supabase
                    .from('flashcard_reviews')
                    .insert({
                        user_id: user.id,
                        flashcard_id: flashcard.id,
                        next_review_at: new Date().toISOString(), // Due immediately
                        interval: 0,
                        repetition: 0,
                        ef_factor: 2.5
                    });
                if (srsError) console.error("Error creating SRS entry:", srsError);
            }

            // Update UI
            setBookmarkedQuestionIds(prev => new Set(prev).add(currentQuestion.id));

            // Optional: Show toast
        } catch (error) {
            console.error("Error bookmarking:", error);
            alert("Failed to save flashcard.");
        }
    };

    const handleNext = async () => {
        if (gameOver) {
            navigate('/dashboard');
            return;
        }

        // Feature 4: Mock Exam Grading on Next
        if ((mode === 'mock_exam' || mode === 'exam') && selectedAnswerId) {
            await processScore(selectedAnswerId);
        }

        setSelectedAnswerId(null);
        setIsAnswered(false);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
        } else {
            // Quiz Finished
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // 1. Calculate Duration
                const endTime = Date.now();
                const durationSeconds = Math.floor((endTime - startTimeRef.current) / 1000);

                // 2. Update Profile Time
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('study_time_seconds')
                    .eq('id', user.id)
                    .single();

                const currentTotal = parseInt(profile?.study_time_seconds as any) || 0;
                const newTotal = currentTotal + durationSeconds;

                await supabase
                    .from('profiles')
                    .update({ study_time_seconds: newTotal })
                    .eq('id', user.id);

                // 3. Save Quiz Submission (If taking a specific quiz)
                if (quizId) {
                    // Calculate Accuracy
                    const maxPossibleScore = questions.reduce((acc, q) => acc + (q.points || 10), 0);
                    const accuracy = maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0;

                    await supabase.from('quiz_submissions').insert({
                        quiz_id: quizId,
                        user_id: user.id,
                        score: accuracy, // Storing as Percentage (0-100)
                        total_questions: questions.length
                    }).select().single().then(async ({ data: submission, error }) => {
                        if (!error && submission) {
                            // 3b. Save Individual Answers
                            const answersToInsert = Object.entries(userAnswers).map(([qId, val]) => ({
                                submission_id: submission.id,
                                question_id: qId,
                                answer_id: val.answerId,
                                is_correct: val.isCorrect
                            }));

                            if (answersToInsert.length > 0) {
                                await supabase.from('submission_answers').insert(answersToInsert);
                            }
                        }
                    });
                }

                // 4. Update Streak Logic
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('current_streak, longest_streak, last_login_date')
                    .eq('id', user.id)
                    .single();

                if (profileData) {
                    const lastDate = profileData.last_login_date ? new Date(profileData.last_login_date) : null;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    let newStreak = profileData.current_streak || 0;

                    if (!lastDate) {
                        newStreak = 1;
                    } else {
                        lastDate.setHours(0, 0, 0, 0);
                        const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

                        if (diffDays === 1) {
                            newStreak += 1;
                        } else if (diffDays > 1) {
                            newStreak = 1;
                        }
                        // If diffDays === 0, streak stays same (already studied today)
                    }

                    const newLongest = Math.max(newStreak, profileData.longest_streak || 0);

                    await supabase
                        .from('profiles')
                        .update({
                            current_streak: newStreak,
                            longest_streak: newLongest,
                            last_login_date: new Date().toISOString()
                        })
                        .eq('id', user.id);

                    if (newStreak > (profileData.current_streak || 0)) {
                        setShowStreakCelebration(newStreak);
                    }
                }

                // 5. Check for Badges (Pass new total time)
                const newBadges = await BadgeService.checkAndAwardBadges(user.id);

                if (newBadges.length > 0) {
                    setEarnedBadges(newBadges);
                    // Delay navigation to show badge
                    await new Promise(resolve => setTimeout(resolve, 4000));
                }
            }
            navigate('/dashboard');
        }
    };

    const handleAIGenerated = (aiQuestions: GeneratedQuestion[]) => {
        const formattedQuestions: Question[] = aiQuestions.map((q, index) => ({
            id: `ai-${index}`,
            objective_id: 'ai',
            type: 'multiple_choice',
            text: q.question,
            points: 10,
            explanation: null, // AI questions don't have static stored explanations yet
            created_at: new Date().toISOString(),
            answers: q.options.map((opt, i) => ({
                id: `opt-${index}-${i}`,
                question_id: `ai-${index}`,
                text: opt,
                is_correct: i === q.correctAnswer,
                created_at: new Date().toISOString()
            }))
        }));

        setQuestions(formattedQuestions);
        setShowAI(false);
        setLoading(false);
        startTimeRef.current = Date.now();
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading quiz...</div>;

    if (showAI) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20 relative overflow-hidden">
                <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="max-w-2xl mx-auto px-4 pt-20 md:pt-24 pb-24 relative z-10">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mb-8 group flex items-center text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 font-bold transition-all"
                    >
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm mr-3 group-hover:scale-110 transition-transform">
                            <ArrowLeft className="h-4 w-4" />
                        </div>
                        Return to Home
                    </button>
                    <AIQuizGenerator onQuizGenerated={handleAIGenerated} />
                </div>
            </div>
        );
    }

    if (showObjectiveSelector) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 py-20 relative overflow-hidden">
                <Navbar profile={profile} />
                <div className="relative z-10 px-4">
                    <ObjectiveSelector
                        certificationId={certificationId!}
                        onStart={(ids) => {
                            setSelectedObjectiveIds(ids);
                            setShowObjectiveSelector(false);
                            setLoading(true);
                        }}
                        onCancel={() => navigate('/dashboard')}
                    />
                </div>
            </div>
        );
    }

    if (questions.length === 0) return <div className="p-8 text-center text-gray-500">No questions found for this certification.</div>;

    if (gameOver) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-500/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

                {earnedBadges.length > 0 && (
                    <BadgeUnlockOverlay
                        badge={earnedBadges[0]}
                        onClose={() => setEarnedBadges(prev => prev.slice(1))}
                    />
                )}

                <div className="max-w-md w-full glass-card p-10 md:p-12 rounded-[40px] shadow-premium border border-white/20 dark:border-slate-800/50 text-center relative z-10 fade-in backdrop-blur-2xl">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-600 to-indigo-700 shadow-xl mb-8">
                        <span className="text-4xl">🏆</span>
                    </div>

                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                        {mode === 'time_attack' ? "Time's Up!" : "Phase Complete"}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                        {mode === 'time_attack' ? "Your session has ended." : "You've successfully completed the quiz."}
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 mb-8 border border-white/10 shadow-inner">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Final Evaluation</p>
                        <div className="text-6xl font-black text-primary-600 dark:text-primary-400 tracking-tighter">{score}</div>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-lg hover:shadow-primary-500/25 active:scale-95 transition-all outline-none"
                    >
                        Secure Rewards & Exit
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    if (mode === 'pvp' && sessionId && user) {
        return (
            <PvPGame
                sessionId={sessionId}
                playerId={user.id}
                onExit={() => navigate('/dashboard')}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-24 relative overflow-hidden">
            <Navbar profile={profile} />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full"></div>

            {showStreakCelebration && (
                <StreakCelebration
                    streak={showStreakCelebration}
                    onClose={() => setShowStreakCelebration(null)}
                />
            )}

            {earnedBadges.length > 0 && (
                <BadgeUnlockOverlay
                    badge={earnedBadges[0]}
                    onClose={() => setEarnedBadges(prev => prev.slice(1))}
                />
            )}

            <div className="max-w-4xl mx-auto px-4 pt-20 md:pt-24 relative z-10">
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="group flex items-center text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 font-bold transition-all w-fit"
                    >
                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm mr-4 group-hover:scale-110 transition-transform">
                            <ArrowLeft className="h-5 w-5" />
                        </div>
                        Exit Quiz
                    </button>

                    <div className="flex flex-wrap items-center gap-3">
                        {(mode === 'time_attack' || mode === 'mock_exam' || mode === 'exam') && (
                            <div className={`px-4 py-2 rounded-2xl glass-card border-none shadow-sm flex items-center font-black ${timeLeft < 10 ? 'text-rose-500 animate-pulse bg-rose-50' : 'text-slate-700 dark:text-white bg-white/50 dark:bg-slate-900/50'}`}>
                                <span className="mr-2 text-sm uppercase tracking-widest text-[10px] opacity-60">Time Remaining</span>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                        )}
                        {mode === 'sudden_death' && (
                            <div className="px-4 py-2 rounded-2xl bg-rose-500 text-white shadow-lg flex items-center font-black animate-pulse">
                                <span className="mr-2">💀</span> SUDDEN DEATH
                            </div>
                        )}
                        {mode === 'pvp' && (
                            <div className="px-4 py-2 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-sm flex items-center font-black">
                                <span className="text-[10px] uppercase tracking-widest mr-2 opacity-60 text-purple-600">Opponent</span> {opponentScore}
                            </div>
                        )}

                        <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center font-black text-slate-900 dark:text-white">
                            <span className="text-[10px] uppercase tracking-widest mr-2 text-slate-400">Score</span> {score}
                        </div>
                        <div className="px-4 py-2 rounded-2xl bg-primary-600 text-white shadow-lg flex items-center font-black">
                            {currentQuestionIndex + 1} <span className="mx-1 opacity-60">/</span> {questions.length}
                        </div>
                    </div>
                </div>

                <QuestionCard
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    isAnswered={isAnswered}
                    selectedAnswerId={selectedAnswerId}
                    onBookmark={handleBookmark}
                    isBookmarked={bookmarkedQuestionIds.has(currentQuestion.id)}
                />

                {isAnswered && (
                    <div className="mt-12 flex justify-end">
                        <button
                            onClick={handleNext}
                            className="group flex items-center px-10 py-5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-black rounded-3xl shadow-xl hover:shadow-primary-500/25 active:scale-95 transition-all text-lg"
                        >
                            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
