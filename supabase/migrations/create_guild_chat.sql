-- 1. Fix Guilds RLS Check
drop policy if exists "Authenticated users can create guilds" on guilds;

create policy "Authenticated users can create guilds" 
on guilds for insert 
to authenticated 
with check (auth.uid() = leader_id);

-- 2. Fix Guild Members Foreign Key (Link to profiles for easier joins)
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints 
    where constraint_name = 'guild_members_user_id_fkey'
    and table_name = 'guild_members'
  ) then
    alter table guild_members drop constraint guild_members_user_id_fkey;
  end if;
end $$;

-- Check if the constraint exists pointing to profiles, if not add it
do $$
begin
  if not exists (
    select 1 from information_schema.referential_constraints 
    where constraint_name = 'guild_members_user_id_profiles_fkey'
  ) then
    alter table guild_members 
    add constraint guild_members_user_id_profiles_fkey 
    foreign key (user_id) references profiles(id) on delete cascade;
  end if;
end $$;

-- 3. Create Guild Messages Table (Chat)
create table if not exists guild_messages (
  id uuid default uuid_generate_v4() primary key,
  guild_id uuid references guilds(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable RLS for Messages
alter table guild_messages enable row level security;

-- 5. Message Policies
drop policy if exists "Guild members can view messages" on guild_messages;
drop policy if exists "Guild members can insert messages" on guild_messages;

create policy "Guild members can view messages"
  on guild_messages for select
  using ( exists (
    select 1 from guild_members
    where guild_id = guild_messages.guild_id
    and user_id = auth.uid()
  ));

create policy "Guild members can insert messages"
  on guild_messages for insert
  with check ( exists (
    select 1 from guild_members
    where guild_id = guild_messages.guild_id
    and user_id = auth.uid()
  ));

-- 6. Enable Realtime
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'guild_messages'
  ) then
    alter publication supabase_realtime add table guild_messages;
  end if;
end $$;
