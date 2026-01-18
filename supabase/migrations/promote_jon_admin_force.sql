-- Forcefully set jonhughes2006@gmail.com to admin role
UPDATE public.profiles
SET role = 'admin'
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND auth.users.email = 'jonhughes2006@gmail.com';

-- Verify the update (this will appear in the output if run in SQL editor, but mainly for confirmation)
SELECT email, role 
FROM public.profiles 
JOIN auth.users ON public.profiles.id = auth.users.id
WHERE email = 'jonhughes2006@gmail.com';
