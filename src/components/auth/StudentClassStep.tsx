import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Box, ArrowLeft, Loader2, Hash } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';
import type { Database } from '../../types/supabase';

type Class = Database['public']['Tables']['classes']['Row'];

interface EnrichedClass extends Class {
    instructor?: {
        full_name: string | null;
        avatar_url: string | null;
    };
    organization?: {
        id: string;
        name: string;
    };
}

interface StudentClassStepProps {
    onBack: () => void;
    onComplete: (classId: string, orgId: string | null) => void;
    onSkip?: () => void; // Optional skip if they don't have a code yet
}

export default function StudentClassStep({ onBack, onComplete, onSkip }: StudentClassStepProps) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [foundClass, setFoundClass] = useState<EnrichedClass | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setFoundClass(null);
        setLoading(true);

        try {
            const cleanCode = code.toUpperCase().trim();
            if (cleanCode.length !== 6) throw new Error('Code must be 6 characters.');

            // Fetch class, teacher, and org
            const { data, error: fetchError } = await supabase
                .from('classes')
                .select(`
                    *,
                    organization:organizations(id, name)
                `)
                .eq('class_code', cleanCode)
                .single();

            if (fetchError || !data) throw new Error('Class not found. Check the code.');

            // Fetch instructor profile separately to avoid strict complex joins if RLS issues
            const { data: instructor } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', data.teacher_id || '')
                .single();

            setFoundClass({
                ...data,
                instructor: instructor || undefined,
                organization: data.organization as any
            });

        } catch (err: any) {
            setError(err.message || 'Invalid class code.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!foundClass) return;
        // Use organization.id if available, otherwise fall back to class.organization_id if types allow, or null
        const orgId = foundClass.organization?.id || (foundClass as any).organization_id || null;
        onComplete(foundClass.id, orgId);
    };

    return (
        <div className="max-w-xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={onBack}
                className="mb-8 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors font-bold text-sm uppercase tracking-widest"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Role Selection
            </button>

            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 mb-4 text-emerald-600">
                    <Box className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Join a Class</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Enter the 6-character code provided by your instructor.</p>
            </div>

            <div className="space-y-6">
                {!foundClass ? (
                    <form onSubmit={handleVerify} className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 animate-pulse" />
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="e.g. X7K9P2"
                            className="w-full pl-12 pr-32 py-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-emerald-500 focus:ring-0 transition-all font-mono text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest text-center"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                        />
                        <button
                            type="submit"
                            disabled={loading || code.length < 6}
                            className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Find'}
                        </button>
                    </form>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 animate-in zoom-in-50 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest">
                                Class Found
                            </span>
                            <span className="text-emerald-500 font-mono font-bold tracking-widest">{code}</span>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{foundClass.title}</h3>
                        <p className="text-slate-500 font-medium mb-6">
                            {foundClass.organization?.name || 'Unknown Organization'}
                        </p>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-8">
                            <div className="flex items-center gap-3">
                                <UserAvatar
                                    avatarUrl={foundClass.instructor?.avatar_url}
                                    fullName={foundClass.instructor?.full_name}
                                    size="sm"
                                />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instructor</p>
                                    <p className="font-bold text-slate-700 dark:text-slate-200">{foundClass.instructor?.full_name || 'Unknown'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setFoundClass(null)}
                                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleJoin}
                                className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                            >
                                Confirm Join
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center font-bold text-sm animate-in shake">
                        {error}
                    </div>
                )}

                {onSkip && !foundClass && (
                    <div className="text-center pt-8">
                        <button onClick={onSkip} className="text-slate-400 hover:text-slate-600 font-medium text-sm underline decoration-slate-300 underline-offset-4">
                            I don't have a code yet, skip for now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
