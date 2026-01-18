import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { StreakService } from '../lib/StreakService';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithPassword: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, metadata: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signOut: async () => { },
    signInWithGoogle: async () => { },
    signInWithPassword: async () => { },
    signUp: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('Auth: Initial session check:', session ? 'Session found' : 'No session');
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`Auth: State Change Event [${event}]:`, session ? 'Session active' : 'No session');
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (session?.user) {
                StreakService.checkAndIncrementStreak(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    const signInWithGoogle = async () => {
        const redirectUrl = `${window.location.origin}/login`;
        console.log('Auth: Initiating Google Login, redirecting to:', redirectUrl);
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
            },
        });
    };

    const signInWithPassword = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
    };

    const signUp = async (email: string, password: string, metadata: any) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut, signInWithGoogle, signInWithPassword, signUp }}>
            {children}
        </AuthContext.Provider>
    );
}
