-- Repair Profiles: Create missing profile records for existing auth users
-- This catches any users created while the trigger was disabled or failing.

INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
SELECT 
    id, 
    email, 
    raw_user_meta_data->>'full_name', 
    raw_user_meta_data->>'avatar_url',
    CASE 
      WHEN raw_user_meta_data->>'role' = 'admin' THEN 'admin'::user_role
      WHEN raw_user_meta_data->>'role' = 'teacher' THEN 'teacher'::user_role
      ELSE 'student'::user_role
    END
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
