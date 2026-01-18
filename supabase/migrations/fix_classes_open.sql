-- Disable RLS on classes and class_enrollments to allow Dev Bypass users to create data.
-- Since they don't have a real Supabase Auth session, strict RLS blocks them.

ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments DISABLE ROW LEVEL SECURITY;
