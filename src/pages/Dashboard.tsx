import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

import RoleOnboarding from '../components/auth/RoleOnboarding';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function Dashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const getProfile = async () => {
        if (!user) return;

        // Skip profile fetch for dev mode mock users
        if (user.id === '00000000-0000-0000-0000-000000000000') {
            setProfile({ id: user.id, role: 'student', full_name: 'Dev Student' } as any);
            setLoading(false);
            return;
        }

        if (user.id === '00000000-0000-0000-0000-000000000001') {
            setProfile({ id: user.id, role: 'admin', full_name: 'Dev Admin' } as any);
            setLoading(false);
            return;
        }

        if (user.id === '00000000-0000-0000-0000-000000000002') {
            setProfile({ id: user.id, role: 'teacher', full_name: 'Dev Teacher' } as any);
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            } else if (data) {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProfile();
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
    }

    // If user has no role, we need them to choose one (Onboarding)
    if (!profile?.role) {
        return <RoleOnboarding onComplete={getProfile} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[var(--bg-app)] transition-colors duration-300">



            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-24">
                <div>
                    {profile?.role === 'admin' && <AdminDashboard />}
                    {profile?.role === 'teacher' && <TeacherDashboard />}
                    {profile?.role === 'student' && <StudentDashboard />}
                </div>
            </div>
        </div>
    );
}
