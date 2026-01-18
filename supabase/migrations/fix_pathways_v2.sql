-- 1. Ensure table exists
CREATE TABLE IF NOT EXISTS pathways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Explicitly add description column if it was missing from an old version
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pathways' AND column_name = 'description') THEN
        ALTER TABLE pathways ADD COLUMN description TEXT;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE pathways ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to cleanly recreate them
DROP POLICY IF EXISTS "Everyone can view pathways" ON pathways;
DROP POLICY IF EXISTS "Teachers can insert pathways" ON pathways;
DROP POLICY IF EXISTS "Teachers can update pathways" ON pathways;
DROP POLICY IF EXISTS "Teachers can delete pathways" ON pathways;

-- 4. Recreate Policies

-- View: Everyone
CREATE POLICY "Everyone can view pathways"
ON pathways FOR SELECT
USING (true);

-- Insert: Teachers & Admins
CREATE POLICY "Teachers can insert pathways"
ON pathways FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('teacher', 'admin')
    )
);

-- Update: Teachers & Admins
CREATE POLICY "Teachers can update pathways"
ON pathways FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('teacher', 'admin')
    )
);

-- Delete: Teachers & Admins
CREATE POLICY "Teachers can delete pathways"
ON pathways FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('teacher', 'admin')
    )
);
