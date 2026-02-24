import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabasePublishableKey) {
    console.error('CRITICAL: Missing Supabase Environment Variables!', { supabaseUrl, supabasePublishableKey });
}

export const supabase = createClient(supabaseUrl || '', supabasePublishableKey || '')
