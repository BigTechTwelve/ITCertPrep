-- Add explanation column to questions table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'explanation') THEN
        ALTER TABLE questions ADD COLUMN explanation TEXT;
    END IF;
END $$;
