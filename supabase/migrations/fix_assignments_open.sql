-- Disable RLS on assignments table for Dev Mode
-- This allows mock users (who lack a real Supabase session) to create and view assignments.

ALTER TABLE assignments DISABLE ROW LEVEL SECURITY;

-- Note: In a production environment, RLS should be enabled and policies
-- should be properly configured based on auth.uid().
