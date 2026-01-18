import { supabase } from './supabase';

export class StreakService {
    static async checkAndIncrementStreak(userId: string) {
        try {
            // 1. Get current profile data
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('current_streak, longest_streak, last_login_date')
                .eq('id', userId)
                .single();

            if (error || !profile) {
                console.error('Error fetching profile for streak check:', error?.message || error || 'No profile found');
                return;
            }

            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const lastLoginStr = profile.last_login_date ? new Date(profile.last_login_date).toISOString().split('T')[0] : null;

            // If already logged in today, do nothing
            if (lastLoginStr === todayStr) {
                return;
            }

            let newCurrentStreak = profile.current_streak || 0;
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            // Check if last login was yesterday (continuation) or older (reset)
            if (lastLoginStr === yesterdayStr) {
                newCurrentStreak += 1;
            } else {
                // Missed a day (or first login), reset to 1
                newCurrentStreak = 1;
            }

            // Update longest streak if needed
            let newLongestStreak = profile.longest_streak || 0;
            if (newCurrentStreak > newLongestStreak) {
                newLongestStreak = newCurrentStreak;
            }

            // 2. Update Profile
            await supabase
                .from('profiles')
                .update({
                    current_streak: newCurrentStreak,
                    longest_streak: newLongestStreak,
                    last_login_date: new Date().toISOString()
                })
                .eq('id', userId);

        } catch (err) {
            console.error('Unexpected error in streak service:', err);
        }
    }
}
