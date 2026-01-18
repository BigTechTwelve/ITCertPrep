-- Enable Realtime for site_settings
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'site_settings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;
    END IF;
END $$;
