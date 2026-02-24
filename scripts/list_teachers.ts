
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required env vars: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY)');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTeachers() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher');

    if (error) {
        console.error('Error fetching teachers:', error);
    } else {
        console.log('Teachers found:', data);
    }
}

listTeachers();
