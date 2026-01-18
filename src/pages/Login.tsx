import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { LogIn, Lock, Mail, Loader2, UserPlus, GraduationCap, Briefcase } from 'lucide-react';

export default function Login() {
    const { signInWithGoogle, signInWithPassword, signUp, user } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                await signUp(email, password, {
                    full_name: fullName,
                    role: role
                });
                setError('Verification email sent! Please check your inbox.');
            } else {
                await signInWithPassword(email, password);
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 relative overflow-hidden transition-colors duration-500">
            {/* Background Blobs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-500/20 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-md w-full relative z-10 glass-card p-10 md:p-12 rounded-[40px] shadow-premium border border-white/20 dark:border-slate-800/50 fade-in backdrop-blur-2xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-600 to-indigo-700 shadow-xl mb-6 transform hover:rotate-6 transition-transform">
                        {isSignUp ? <UserPlus className="w-10 h-10 text-white" /> : <LogIn className="w-10 h-10 text-white" />}
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                        {isSignUp ? 'Create ' : 'Welcome '}<span className="text-primary-600 dark:text-primary-400">{isSignUp ? 'Account' : 'Back'}</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">
                        {isSignUp ? 'Join the elite certification arena.' : 'The ultimate certification arena awaits.'}
                    </p>
                </div>

                <div className="space-y-6">
                    {!isSignUp && (
                        <>
                            <button
                                onClick={signInWithGoogle}
                                className="group relative w-full flex items-center justify-center py-4 px-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-black hover:border-primary-500 dark:hover:border-primary-500 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="absolute left-6">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                </div>
                                Secure Google Login
                            </button>

                            <div className="flex items-center space-x-4">
                                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Or with Email</span>
                                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                            </div>
                        </>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className={`p-3 rounded-lg border text-sm font-medium text-center ${error.includes('sent') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                {error}
                            </div>
                        )}

                        {isSignUp && (
                            <div className="relative group">
                                <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Full Name"
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                required
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                            />
                        </div>

                        {isSignUp && (
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${role === 'student' ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                                >
                                    <GraduationCap className="w-5 h-5" />
                                    <span className="font-bold">Student</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('teacher')}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${role === 'teacher' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                                >
                                    <Briefcase className="w-5 h-5" />
                                    <span className="font-bold">Teacher</span>
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                                </>
                            ) : (
                                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                            )}
                        </button>
                    </form>

                    <div className="pt-2 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors"
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </button>
                    </div>

                    <div className="pt-6 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                            By entering the arena, you agree to our <span className="text-primary-600">House Rules</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
