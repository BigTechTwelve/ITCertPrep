-- Forcefully set jonhughes2006@gmail.com to admin role
-- BYPASS TRIGGERS first
SET session_replication_role = 'replica';

UPDATE public.profiles
SET role = 'admin'
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND auth.users.email = 'jonhughes2006@gmail.com';

-- RESET TRIGGERS
SET session_replication_role = 'origin';

-- Verify the update
SELECT auth.users.email, public.profiles.role 
FROM public.profiles 
JOIN auth.users ON public.profiles.id = auth.users.id
WHERE auth.users.email = 'jonhughes2006@gmail.com';
