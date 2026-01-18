-- SQL Script to set a user as an Admin
-- Replace 'YOUR_USER_EMAIL' with the email of the account you want to promote

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'YOUR_USER_EMAIL';

-- To check all users and their roles:
-- SELECT email, full_name, role FROM public.profiles;
