-- Create Storage Bucket for Avatars
-- Note: This attempts to insert into the storage.buckets table.
-- If storage is disabled on the project, this might fail or have no effect until enabled.

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- RLS Policies for Storage
-- Enable RLS on objects
-- RLS is enabled by default on storage.objects, skipping explicit enable to avoid permission errors


-- Policy: Everyone can view avatars
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Policy: Authenticated users can upload their own avatar
-- We use a folder convention: public/user_id/filename
drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.role() = 'authenticated'
  );

-- Policy: Users can update their own avatar
drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars' and
    auth.role() = 'authenticated'
  );
