import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteSettings {
    ai_enabled: boolean;
    [key: string]: any;
}

export function useSettings() {
    const [settings, setSettings] = useState<SiteSettings>({
        ai_enabled: true, // Default to true while loading
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('key, value');

            if (error) throw error;

            if (data) {
                const mappedSettings = data.reduce((acc, curr) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {} as Record<string, any>);

                setSettings(mappedSettings as SiteSettings);
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('site_settings_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'site_settings'
            }, (payload) => {
                const updatedSetting = payload.new as any;
                if (updatedSetting && updatedSetting.key) {
                    setSettings(prev => ({
                        ...prev,
                        [updatedSetting.key]: updatedSetting.value
                    }));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    return { settings, loading, refresh: fetchSettings };
}
