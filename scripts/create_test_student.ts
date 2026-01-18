
import { createClient } from '@supabase/supabase-js';

// Hardcoded for immediate execution to bypass missing dotenv
const supabaseUrl = 'https://qvaqoxgocqmxntrbqcsm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2YXFveGdvY3FteG50cmJxY3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNjQ4OTUsImV4cCI6MjA4Mzg0MDg5NX0.bH_SqQiuBtZZ-_c0rn4fq3hPh8DAYahk6EsPZMb1hHk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestStudent() {
    const email = 'itcertprep.student@gmail.com';
    const password = 'password123';

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
