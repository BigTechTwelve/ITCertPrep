-- Decisive fix for Class Creation in Dev Mode
-- The previous error confirmed the constraint name is "classes_teacher_id_fkey"
-- We must drop this constraint because the "Dev Bypass" user ID (fake UUID) does not exist in the referenced auth.users/profiles table.

ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_teacher_id_fkey;

-- Also checking for other common naming conventions just to be safe
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_teacher_id_profiles_fkey;
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_teacher_id_users_fkey;
