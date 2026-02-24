import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabasePublishableKeyFromEnv = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const supabasePublishableKey =
    supabasePublishableKeyFromEnv || supabaseAnonKey

if (!supabaseUrl || !supabasePublishableKey) {
    console.error('CRITICAL: Missing Supabase Environment Variables!', {
        supabaseUrl,
        hasPublishableKey: !!supabasePublishableKeyFromEnv,
        hasAnonKey: !!supabaseAnonKey,
        selectedKeySource: supabasePublishableKeyFromEnv ? 'VITE_SUPABASE_PUBLISHABLE_KEY' : (supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : 'none'),
    });
}

export const supabase = createClient(supabaseUrl || '', supabasePublishableKey || '')
