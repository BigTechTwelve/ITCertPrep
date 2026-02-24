
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
const studentEmail = process.env.TEST_STUDENT_EMAIL;
const studentPassword = process.env.TEST_STUDENT_PASSWORD;

if (!supabaseUrl || !supabaseKey || !studentEmail || !studentPassword) {
    throw new Error('Missing required env vars: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY), TEST_STUDENT_EMAIL, TEST_STUDENT_PASSWORD');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestStudent() {
    const email = studentEmail;
    const password = studentPassword;

    console.log(`Creating user: ${email}...`);

    // 1. Sign Up
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Test Student',
                avatar_url: null,
                points: 1250,
                role: 'student'
            }
        }
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log('User already exists.');
        } else {
            console.error('Error creating student details:', JSON.stringify(error, null, 2));
        }
    } else {
        console.log('Student created successfully!');
        if (data.user) {
            console.log('ID:', data.user.id);
            console.log('Email:', data.user.email);
        }
    }
}

createTestStudent();
