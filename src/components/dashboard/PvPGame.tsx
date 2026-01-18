import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle, XCircle, Trophy, Swords } from 'lucide-react';

interface Props {
    sessionId: string;
    playerId: string;
    onExit: () => void;
}

export default function PvPGame({ sessionId, playerId, onExit }: Props) {
    const [gameSession, setGameSession] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [waitingForNext, setWaitingForNext] = useState(false);
    const [opponentName, setOpponentName] = useState('Opponent');

    // Load initial game state
    useEffect(() => {
        async function loadGame() {
            const { data } = await supabase
                .from('game_sessions')
                .select('*, player_1:player_1_id(username), player_2:player_2_id(username)')
                .eq('id', sessionId)
                .single();

            if (data) {
                setGameSession(data);
                // Determine opponent name
                const isP1 = playerId === data.player_1_id;
                setOpponentName(isP1 ? data.player_2?.username : data.player_1?.username);
            }
        }
        loadGame();

        // Subscribe to live updates
        const channel = supabase
            .channel(`game:${sessionId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${sessionId}` },
                (payload) => {
                    setGameSession(payload.new);
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [sessionId, playerId]);

    if (!gameSession) return <div className="p-10 text-center animate-pulse">Loading Battle Arena...</div>;

    const questions = gameSession.questions || [];
    const currentQ = questions[currentQuestionIndex];
    const isPlayer1 = playerId === gameSession.player_1_id;
    const myScore = isPlayer1 ? gameSession.player_1_score : gameSession.player_2_score;
    const opponentScore = isPlayer1 ? gameSession.player_2_score : gameSession.player_1_score;
    const opponentProgress = isPlayer1 ? gameSession.player_2_progress : gameSession.player_1_progress;

    // Handle Answer
    const handleAnswer = async (answerText: string) => {
        if (isAnswered) return;
        setSelectedAnswer(answerText);
        setIsAnswered(true);

        const isCorrect = answerText === currentQ.correct_answer; // Assuming 'correct_answer' is in the json object
        // NOTE: In a real app, we should validate on server or check ID. 
        // For MVP, simplistic check against the JSON content.

        // Update Score & Progress in DB
        const updates: any = {};
        if (isPlayer1) {
            updates.player_1_progress = currentQuestionIndex + 1;
            if (isCorrect) updates.player_1_score = myScore + 10;
        } else {
            updates.player_2_progress = currentQuestionIndex + 1;
            if (isCorrect) updates.player_2_score = myScore + 10;
        }

        await supabase.from('game_sessions').update(updates).eq('id', sessionId);

        // Auto-advance after delay
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setIsAnswered(false);
                setSelectedAnswer(null);
            } else {
                setWaitingForNext(true); // Game Over state for me
            }
        }, 1500);
    };

    // Game Over Screen
    if (waitingForNext && gameSession) {
        const iFinished = (isPlayer1 ? gameSession.player_1_progress : gameSession.player_2_progress) >= questions.length;
        const oppFinished = (isPlayer1 ? gameSession.player_2_progress : gameSession.player_1_progress) >= questions.length;

        if (iFinished && oppFinished) {
            const iWon = myScore > opponentScore;
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-indigo-500">
                        {iWon ? (
                            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-4 animate-bounce" />
                        ) : (
                            <Swords className="w-24 h-24 text-slate-400 mx-auto mb-4" />
                        )}
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                            {iWon ? 'VICTORY!' : 'DEFEAT'}
                        </h2>
                        <p className="text-lg text-slate-500 font-bold mb-6">
                            {iWon ? `You crushed ${opponentName}!` : `${opponentName} was faster.`}
                        </p>

                        <div className="flex justify-center gap-8 mb-8">
                            <div className="text-center">
                                <div className="text-sm font-bold text-slate-400">YOU</div>
                                <div className="text-3xl font-black text-indigo-600">{myScore} pts</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-bold text-slate-400">OPPONENT</div>
                                <div className="text-3xl font-black text-rose-600">{opponentScore} pts</div>
                            </div>
                        </div>

                        <button onClick={onExit} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4">
                <div className="text-center text-white">
                    <div className="animate-pulse mb-4 text-2xl font-bold">Waiting for {opponentName} to finish...</div>
                    <div className="w-64 h-2 bg-slate-700 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${(opponentProgress / questions.length) * 100}%` }}></div>
                    </div>
                </div>
            </div>
        );
    }

    /* --- GAMEPLAY UI --- */
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            {/* HUD */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-indigo-200">
                        ME
                    </div>
                    <div>
                        <div className="text-2xl font-black text-indigo-600">{myScore}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Score</div>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="text-sm font-bold text-slate-400 mb-1">VS</div>
                    <div className="flex gap-1">
                        {questions.map((_: any, i: number) => (
                            <div
                                key={i}
                                className={`h-2 w-8 rounded-full transition-colors ${i < currentQuestionIndex ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                    <div>
                        <div className="text-2xl font-black text-rose-600">{opponentScore}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{opponentName}</div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold border-2 border-rose-200">
                        OP
                    </div>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 min-h-[400px] flex flex-col">
                <div className="p-8 md:p-12 flex-grow">
                    <span className="inline-block px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm mb-6">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-8">
                        {currentQ?.text}
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {/* 
                           Note: 'answers' must be present in the fetched JSON.
                           If using 'get_random_questions', ensure it returns answers array.
                        */}
                        {currentQ?.answers?.map((ans: any) => {
                            const isSelected = selectedAnswer === ans.text;
                            // Simplified visual logic for MVP: just show selection state immediately
                            // Real feedback (green/red) is shown after selection
                            let btnClass = "border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/50";

                            if (isAnswered) {
                                if (isSelected) {
                                    btnClass = ans.text === currentQ.correct_answer
                                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400"
                                        : "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
                                } else if (ans.text === currentQ.correct_answer) {
                                    btnClass = "border-emerald-500 text-emerald-700 dark:text-emerald-400 opacity-75"; // Reveal correct
                                } else {
                                    btnClass = "opacity-50 grayscale";
                                }
                            }

                            return (
                                <button
                                    key={ans.id}
                                    onClick={() => handleAnswer(ans.text)}
                                    disabled={isAnswered}
                                    className={`relative p-6 rounded-xl text-left font-medium transition-all transform active:scale-[0.99] ${btnClass}`}
                                >
                                    {ans.text}
                                    {isAnswered && isSelected && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            {ans.text === currentQ.correct_answer
                                                ? <CheckCircle className="w-6 h-6 text-emerald-500" />
                                                : <XCircle className="w-6 h-6 text-red-500" />
                                            }
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Opponent Progress Bar (Live) */}
            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center gap-4 shadow-lg">
                <div className="font-bold text-rose-400 w-24 truncate">{opponentName}</div>
                <div className="flex-1 bg-slate-700 h-3 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-rose-500 transition-all duration-500 ease-out"
                        style={{ width: `${(opponentProgress / questions.length) * 100}%` }}
                    />
                </div>
                <div className="text-xs font-bold text-slate-400">{Math.round((opponentProgress / questions.length) * 100)}%</div>
            </div>
        </div>
    );
}
