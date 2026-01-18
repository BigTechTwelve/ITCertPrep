-- Force Schema Refresh
-- This simple comment update signals PostgREST to rebuild its schema cache.
-- This is necessary to resolve the "Could not find the 'bio' column" error.

COMMENT ON COLUMN public.profiles.bio IS 'User biography text.';
