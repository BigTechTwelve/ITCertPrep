-- Security hardening patch (2026-02-24)
-- Re-enable RLS where prior development migrations disabled it,
-- and tighten broad policies.

BEGIN;

-- 1) Re-enable RLS on core tables.
ALTER TABLE IF EXISTS public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pathways ENABLE ROW LEVEL SECURITY;

-- 2) Ensure classes has baseline policies.
DROP POLICY IF EXISTS "Everyone can select classes" ON public.classes;
CREATE POLICY "Everyone can select classes"
ON public.classes
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Teachers can manage own classes" ON public.classes;
CREATE POLICY "Teachers can manage own classes"
ON public.classes
FOR ALL
USING (
  auth.uid() = teacher_id
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
)
WITH CHECK (
  auth.uid() = teacher_id
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);

-- 3) Tighten notifications insert policy: users can only create their own rows.
DROP POLICY IF EXISTS "Users can insert notifications" ON public.notifications;
CREATE POLICY "Users can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4) Tighten avatar storage object policies to user-owned folder convention.
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

COMMIT;
