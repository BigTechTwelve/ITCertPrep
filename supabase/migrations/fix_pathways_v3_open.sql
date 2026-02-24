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

-- 3. Security hardening
-- Keep RLS enabled. Development bypass must not disable table security.
ALTER TABLE pathways ENABLE ROW LEVEL SECURITY;

-- If you prefer keeping RLS enabled but open to all:
-- ALTER TABLE pathways ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Public Full Access" ON pathways;
-- CREATE POLICY "Public Full Access" ON pathways USING (true) WITH CHECK (true);
