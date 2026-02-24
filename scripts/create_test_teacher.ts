
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
const teacherEmail = process.env.TEST_TEACHER_EMAIL;
const teacherPassword = process.env.TEST_TEACHER_PASSWORD;

if (!supabaseUrl || !supabaseKey || !teacherEmail || !teacherPassword) {
    throw new Error('Missing required env vars: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY), TEST_TEACHER_EMAIL, TEST_TEACHER_PASSWORD');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestTeacher() {
    const email = teacherEmail;
    const password = teacherPassword;

    console.log(`Creating teacher: ${email}...`);

    // 1. Sign Up
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Test Teacher',
                avatar_url: null,
                points: 0,
                role: 'teacher'
            }
        }
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log('Teacher already exists.');
        } else {
            console.error('Error creating teacher details:', JSON.stringify(error, null, 2));
        }
    } else {
        console.log('Teacher created successfully!');
        if (data.user) {
            console.log('ID:', data.user.id);
            console.log('Email:', data.user.email);

            // Explicitly update profile role just in case trigger didn't handle it
            await supabase
                .from('profiles')
                .update({ role: 'teacher' })
                .eq('id', data.user.id);
        }
    }
}

createTestTeacher();
