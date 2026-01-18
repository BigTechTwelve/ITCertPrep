-- 1. Ensure table exists (Same as before)
CREATE TABLE IF NOT EXISTS pathways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure columns exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pathways' AND column_name = 'description') THEN
        ALTER TABLE pathways ADD COLUMN description TEXT;
    END IF;
END $$;

-- 3. Relax RLS for Development
-- Since Dev Bypass buttons don't provide a real Supabase JWT, we must allow 'anon' role (public) to insert/update
-- OR we disable RLS. Disabling RLS is cleaner for "Dev Mode" on this specific table.

ALTER TABLE pathways DISABLE ROW LEVEL SECURITY;

-- If you prefer keeping RLS enabled but open to all:
-- ALTER TABLE pathways ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Public Full Access" ON pathways;
-- CREATE POLICY "Public Full Access" ON pathways USING (true) WITH CHECK (true);
