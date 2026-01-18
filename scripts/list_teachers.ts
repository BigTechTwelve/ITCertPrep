
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qvaqoxgocqmxntrbqcsm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2YXFveGdvY3FteG50cmJxY3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNjQ4OTUsImV4cCI6MjA4Mzg0MDg5NX0.bH_SqQiuBtZZ-_c0rn4fq3hPh8DAYahk6EsPZMb1hHk';

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
