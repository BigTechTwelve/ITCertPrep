-- Remove default 'student' from profiles.role to allow detection of new OAuth users
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;

-- Update handle_new_user to leave role as NULL if not in metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    CASE 
      WHEN new.raw_user_meta_data->>'role' = 'admin' THEN 'admin'::user_role
      WHEN new.raw_user_meta_data->>'role' = 'teacher' THEN 'teacher'::user_role
      WHEN new.raw_user_meta_data->>'role' = 'student' THEN 'student'::user_role
      ELSE NULL -- Allow null for onboarding check
    END
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
