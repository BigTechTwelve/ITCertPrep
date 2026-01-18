-- Remove Foreign Key constraint on teacher_id to allow Mock Users (Dev Bypass) to create classes.
-- The mock user ID (0000...) does not exist in auth.users, so the FK constraint fails.

-- Try to drop common constraint names
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_teacher_id_fkey;
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_teacher_id_users_fkey;
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_teacher_id_profiles_fkey;

-- Also ensure teacher_id is nullable if we ever want to create system classes? (Optional)
-- ALTER TABLE classes ALTER COLUMN teacher_id DROP NOT NULL;
