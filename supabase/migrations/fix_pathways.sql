-- Ensure pathways table exists
CREATE TABLE IF NOT EXISTS pathways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pathways ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Everyone can view pathways
CREATE POLICY "Everyone can view pathways"
ON pathways FOR SELECT
USING (true);

-- 2. Teachers/Admins can insert
-- (For now, allowing authenticated users with role 'teacher' or 'admin', or just all authenticated for simplicity if roles aren't strictly enforced in DB yet, but let's try strict first)
CREATE POLICY "Teachers can insert pathways"
ON pathways FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('teacher', 'admin')
    )
);

-- 3. Teachers/Admins can update
CREATE POLICY "Teachers can update pathways"
ON pathways FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('teacher', 'admin')
    )
);

-- 4. Teachers/Admins can delete
CREATE POLICY "Teachers can delete pathways"
ON pathways FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('teacher', 'admin')
    )
);
