-- Global Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Anyone can read settings
CREATE POLICY "Public read access for site_settings"
ON site_settings FOR SELECT
TO authenticated, anon
USING (true);

-- 2. Only admins can update settings
CREATE POLICY "Admins can update site_settings"
ON site_settings FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 3. Only admins can insert settings
CREATE POLICY "Admins can insert site_settings"
ON site_settings FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Seed initial AI setting
INSERT INTO site_settings (key, value, description)
VALUES ('ai_enabled', 'true'::jsonb, 'Master toggle for all Gemini AI related features')
ON CONFLICT (key) DO NOTHING;
