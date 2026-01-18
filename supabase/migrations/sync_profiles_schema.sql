-- Sync Profiles Schema
-- Adds all potentially missing columns to the profiles table to match schema.sql.
-- This handles cases where columns were added to schema.sql but not migrated to the live DB.

-- 1. Bio (Biography text)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;

-- 2. Visibility Settings
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_public boolean default true;

-- 3. Gamification Stats
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points integer default 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS study_time_seconds bigint default 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_streak integer default 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longest_streak integer default 0;

-- 4. Metadata
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS school_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_date timestamp with time zone;

-- Force schema cache refresh
NOTIFY pgrst, 'reload config';
