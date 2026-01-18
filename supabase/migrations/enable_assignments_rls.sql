-- Re-enable RLS on assignments table
-- This resolves the security warning where policies existed but RLS was disabled.

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- The following policies were already defined in the initial creation:
-- 1. "Teachers can manage assignments for their classes"
-- 2. "Students can view assignments for their enrolled classes"

-- We ensure they are active by simply enabling RLS.
-- No additional policy creation is needed if they already exist, 
-- but if we wanted to be idempotent we could re-define them here.
-- Since the user reported they exist ("Policies include ..."), we just need to enable RLS.
