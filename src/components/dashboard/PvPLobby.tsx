import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { Users, Copy, ArrowRight, Loader } from 'lucide-react';

type Certification = Database['public']['Tables']['certifications']['Row'];

interface Props {
    certification: Certification;
    onClose: () => void;
    onGameStart: (sessionId: string, playerId: string) => void;
}

export default function PvPLobby({ certification, onClose, onGameStart }: Props) {
    const [view, setView] = useState<'menu' | 'hosting' | 'joining'>('menu');
    const [joinCode, setJoinCode] = useState('');
    const [lobbyCode, setLobbyCode] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Host Logic: Create Session & Wait
    const createSession = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // 1. Fetch random questions for this match
            const { data: questions, error: qError } = await supabase
                .rpc('get_pvp_questions', {
                    limit_count: 5 // Short match
                });

            if (qError) throw qError;
            if (!questions || questions.length === 0) throw new Error('No questions available for this exam.');

            // 2. Generate Code
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();

            // 3. Create Session with Questions
            const { data, error } = await supabase
                .from('game_sessions')
                .insert({
                    code,
                    certification_id: certification.id,
                    player_1_id: user.id,
                    status: 'waiting',
                    questions: questions, // Save the question set
                    player_1_score: 0,
                    player_2_score: 0,
                    player_1_progress: 0,
                    player_2_progress: 0
                })
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setLobbyCode(data.code);
                setSessionId(data.id);
                setView('hosting');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Join Logic: Find Session & Update
    const joinSession = async () => {
        if (!joinCode) return;
        setLoading(true);
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data: session, error: findError } = await supabase
                .from('game_sessions')
                .select('*')
                .eq('code', joinCode.toUpperCase())
                .eq('status', 'waiting')
                .single();

            if (findError || !session) throw new Error('Lobby not found or full.');

            const { error: updateError } = await supabase
                .from('game_sessions')
                .update({
                    player_2_id: user.id,
                    status: 'playing'
                })
                .eq('id', session.id);

            if (updateError) throw updateError;

            // Start Game
            onGameStart(session.id, user.id);

        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Realtime Subscription (For Host)
    useEffect(() => {
        if (view === 'hosting' && sessionId) {
            const channel = supabase
                .channel(`lobby:${sessionId}`)
                .on(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${sessionId}` },
                    (payload) => {
                        const newSession = payload.new as any;
                        if (newSession.status === 'playing' && newSession.player_2_id) {
                            // Player 2 joined!
                            onGameStart(newSession.id, newSession.player_1_id);
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [view, sessionId, onGameStart]);

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <div className="relative bg-white dark:bg-slate-900 rounded-[32px] px-8 py-10 text-left overflow-hidden shadow-premium transform transition-all sm:my-8 sm:max-w-md sm:w-full border border-white dark:border-slate-800">

                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 dark:text-red-400 font-bold">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'menu' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">PvP Arena</h3>
                                <p className="text-slate-500 font-medium">Challenge a friend to a live Quiz Battle!</p>
                            </div>

                            <button
                                onClick={createSession}
                                disabled={loading}
                                className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                <Users className="mr-3 h-6 w-6" />
                                Create Lobby
                            </button>
                            <button
                                onClick={() => setView('joining')}
                                className="w-full flex items-center justify-center px-6 py-4 border-2 border-slate-200 dark:border-slate-700 text-lg font-bold rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                            >
                                Enter Join Code
                            </button>
                        </div>
                    )}

                    {view === 'hosting' && (
                        <div className="text-center space-y-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Waiting for opponent...</h3>
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                                        <Loader className="h-12 w-12 text-indigo-600 animate-spin relative z-10" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Lobby Code</p>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-4xl font-mono font-black tracking-widest text-indigo-600 dark:text-indigo-400">{lobbyCode}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(lobbyCode)}
                                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <Copy className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <button onClick={onClose} className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Cancel Lobby</button>
                        </div>
                    )}

                    {view === 'joining' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Enter Lobby Code</h3>
                                <p className="text-slate-500 text-sm">Ask your friend for the 6-digit code</p>
                            </div>

                            <input
                                type="text"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                placeholder="X X X X X X"
                                className="block w-full text-center text-3xl font-mono font-bold tracking-[0.5em] bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all uppercase placeholder:tracking-normal placeholder:text-slate-300"
                                maxLength={6}
                            />

                            <button
                                onClick={joinSession}
                                disabled={!joinCode || loading}
                                className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
                            >
                                {loading ? 'Joining...' : 'Start Battle'}
                                {!loading && <ArrowRight className="ml-2 h-6 w-6" />}
                            </button>

                            <button onClick={() => setView('menu')} className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-700">Back</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
