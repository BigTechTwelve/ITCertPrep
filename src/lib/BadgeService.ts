import { supabase } from './supabase';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'achievement' | 'mastery' | 'dedication';
}

export class BadgeService {

    static async checkAndAwardBadges(userId: string): Promise<Badge[]> {
        // The DB Trigger now handles awarding badges based on progress.
        // We just need to check if any *new* badges appeared since the last check.
        // For simplicity in this demo, we can just fetch the latest badges and 
        // rely on the UI to show notifications if they were created "recently" (e.g. last 1 minute)

        const { data: recentBadges } = await supabase
            .from('user_badges')
            .select(`
                badge_id,
                awarded_at,
                badges (*)
            `)
            .eq('user_id', userId)
            .gt('awarded_at', new Date(Date.now() - 10000).toISOString()); // Last 10 seconds

        if (!recentBadges || recentBadges.length === 0) return [];

        // Return the badge details
        return recentBadges.map(rb => rb.badges) as unknown as Badge[];
    }
}
