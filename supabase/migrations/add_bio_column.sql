-- Add missing bio column
-- It appears the column is missing in the live database, despite being in schema.sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;

-- Force schema cache refresh
NOTIFY pgrst, 'reload config';
