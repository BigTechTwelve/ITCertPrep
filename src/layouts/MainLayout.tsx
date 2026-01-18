import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function MainLayout() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;
            try {
                // Mock users check
                if (user.id === '00000000-0000-0000-0000-000000000000') {
                    setProfile({ id: user.id, role: 'student', full_name: 'Dev Student', points: 1250 } as any);
                    return;
                }
                if (user.id === '00000000-0000-0000-0000-000000000001') {
                    setProfile({ id: user.id, role: 'admin', full_name: 'Dev Admin' } as any);
                    return;
                }
                if (user.id === '00000000-0000-0000-0000-000000000002') {
                    setProfile({ id: user.id, role: 'teacher', full_name: 'Dev Teacher' } as any);
                    return;
                }

                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) setProfile(data);
            } catch (error) {
                console.error('Error fetching profile for layout:', error);
            }
        }
        fetchProfile();
    }, [user]);

    // Don't block UI on profile load, just render navbar with partial/null data if needed
    // or wait for basic auth check from ProtectedRoute (which wraps this)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[var(--bg-app)] transition-colors duration-300">
            <Navbar profile={profile} />
            <Outlet context={{ profile, refreshProfile: () => { } }} />
        </div>
    );
}
