-- Safely add columns to questions table
DO $$ 
BEGIN 
    -- Add created_by if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'created_by') THEN
        ALTER TABLE questions ADD COLUMN created_by UUID REFERENCES profiles(id);
    END IF;

    -- Add visibility if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'visibility') THEN
        ALTER TABLE questions ADD COLUMN visibility TEXT CHECK (visibility IN ('public', 'private')) DEFAULT 'public';
    END IF;

    -- Add class_id if not exists (for class-specific questions)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'class_id') THEN
        ALTER TABLE questions ADD COLUMN class_id UUID REFERENCES classes(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Update RLS policies for questions

-- Drop existing policies to avoid conflicts (and to update them)
DROP POLICY IF EXISTS "Teachers can insert their own questions" ON questions;
DROP POLICY IF EXISTS "Teachers can update their own questions" ON questions;
DROP POLICY IF EXISTS "Teachers can delete their own questions" ON questions;
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON questions; -- We need to replace this one

-- 1. View Policy: Public questions OR Created by user
CREATE POLICY "Users can view public or own questions"
ON questions FOR SELECT
USING (
    visibility = 'public' 
    OR 
    created_by = auth.uid()
);

-- 2. Teachers can insert their own questions
CREATE POLICY "Teachers can insert their own questions"
ON questions FOR INSERT
WITH CHECK (
    auth.uid() = created_by
    AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- 3. Teachers can update their own questions
CREATE POLICY "Teachers can update their own questions"
ON questions FOR UPDATE
USING (auth.uid() = created_by);

-- 4. Teachers can delete their own questions
CREATE POLICY "Teachers can delete their own questions"
ON questions FOR DELETE
USING (auth.uid() = created_by);
