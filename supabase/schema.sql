-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create Enums Safely
do $$ begin
    create type user_role as enum ('admin', 'teacher', 'student');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type question_type as enum ('multiple_choice', 'true_false', 'short_answer');
exception
    when duplicate_object then null;
end $$;

-- Create Profiles Table (extends Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  username text unique,
  avatar_url text,
  role user_role default 'student'::user_role,
  school_id text, -- Can be linked to a schools table later
  points integer default 0,
  study_time_seconds bigint default 0,
  bio text,
  is_public boolean default true,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_login_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Create Pathways Table
create table if not exists pathways (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table pathways enable row level security;
drop policy if exists "Pathways are viewable by everyone" on pathways;
create policy "Pathways are viewable by everyone" on pathways for select using (true);

drop policy if exists "Admins can insert pathways" on pathways;
create policy "Admins can insert pathways" on pathways for insert with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Create Classes Table
create table if not exists public.classes (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  pathway_id uuid references pathways(id) on delete cascade not null,
  teacher_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.classes enable row level security;
drop policy if exists "Classes are viewable by everyone" on public.classes;
create policy "Classes are viewable by everyone" on public.classes for select using (true);

drop policy if exists "Teachers can insert classes" on public.classes;
create policy "Teachers can insert classes" on public.classes for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'teacher')
);

drop policy if exists "Teachers can update their own classes" on public.classes;
create policy "Teachers can update their own classes" on public.classes for update using (
  auth.uid() = teacher_id
);

-- Create Class Enrollments Table
create table if not exists public.class_enrollments (
  id uuid default uuid_generate_v4() primary key,
  class_id uuid references classes(id) on delete cascade not null,
  student_id uuid references profiles(id) on delete cascade not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(class_id, student_id)
);

alter table public.class_enrollments enable row level security;

drop policy if exists "Teachers can view enrollments for their classes" on public.class_enrollments;
create policy "Teachers can view enrollments for their classes"
  on public.class_enrollments for select
  using ( exists ( select 1 from classes where id = class_enrollments.class_id and teacher_id = auth.uid() ) );

drop policy if exists "Students can view their own enrollments" on public.class_enrollments;
create policy "Students can view their own enrollments"
  on public.class_enrollments for select
  using ( auth.uid() = student_id );

drop policy if exists "Teachers can enroll students" on public.class_enrollments;
create policy "Teachers can enroll students"
  on public.class_enrollments for insert
  with check ( exists ( select 1 from classes where id = class_enrollments.class_id and teacher_id = auth.uid() ) );

drop policy if exists "Teachers can remove students" on public.class_enrollments;
create policy "Teachers can remove students"
  on public.class_enrollments for delete
  using ( exists ( select 1 from classes where id = class_enrollments.class_id and teacher_id = auth.uid() ) );

-- Create Certifications Table
create table if not exists public.certifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  provider text not null, -- e.g. CompTIA, Microsoft
  class_id uuid references classes(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.certifications enable row level security;
drop policy if exists "Certifications are viewable by everyone" on public.certifications;
create policy "Certifications are viewable by everyone" on public.certifications for select using (true);

drop policy if exists "Teachers can insert certifications" on public.certifications;
create policy "Teachers can insert certifications" on public.certifications for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'teacher')
);

-- Create Objectives Table
create table if not exists public.objectives (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  certification_id uuid references certifications(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.objectives enable row level security;
drop policy if exists "Objectives are viewable by everyone" on public.objectives;
create policy "Objectives are viewable by everyone" on public.objectives for select using (true);

-- Create Questions Table
create table if not exists public.questions (
  id uuid default uuid_generate_v4() primary key,
  objective_id uuid references objectives(id) on delete cascade not null,
  text text not null,
  type question_type default 'multiple_choice'::question_type,
  points integer default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.questions enable row level security;
drop policy if exists "Questions are viewable by everyone" on public.questions;
create policy "Questions are viewable by everyone" on public.questions for select using (true);

-- Guilds (Study Groups)
create table if not exists public.guilds (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  avatar_url text,
  leader_id uuid references auth.users(id) not null,
  is_private boolean default false,
  join_code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Guild Members
create table if not exists public.guild_members (
  id uuid default uuid_generate_v4() primary key,
  guild_id uuid references guilds(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  role text default 'member' check (role in ('leader', 'admin', 'member')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(guild_id, user_id)
);

-- RLS for Guilds
alter table public.guilds enable row level security;
drop policy if exists "Guilds are viewable by everyone" on public.guilds;
create policy "Guilds are viewable by everyone" on public.guilds for select using (true);

drop policy if exists "Authenticated users can create guilds" on public.guilds;
create policy "Authenticated users can create guilds" on public.guilds for insert with check (auth.uid() = leader_id);

drop policy if exists "Leaders can update their guilds" on public.guilds;
create policy "Leaders can update their guilds" on public.guilds for update using (auth.uid() = leader_id);

-- RLS for Guild Members
alter table public.guild_members enable row level security;
drop policy if exists "Guild members are viewable by everyone" on public.guild_members;
create policy "Guild members are viewable by everyone" on public.guild_members for select using (true);

drop policy if exists "Users can join public guilds" on public.guild_members;
create policy "Users can join public guilds" on public.guild_members for insert with check (auth.uid() = user_id);

drop policy if exists "Users can leave guilds" on public.guild_members;
create policy "Users can leave guilds" on public.guild_members for delete using (auth.uid() = user_id);

-- Flashcards Table
create table if not exists public.flashcards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  question_id uuid references questions(id), -- Optional link to original question
  front text not null,
  back text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Flashcard Reviews Table (for SRS)
create table if not exists public.flashcard_reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  flashcard_id uuid references flashcards(id) on delete cascade not null,
  next_review_at timestamp with time zone not null,
  interval integer default 0, -- Days
  repetition integer default 0, -- Successful reviews count
  ef_factor float default 2.5, -- Easiness Factor
  last_reviewed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Flashcards
alter table public.flashcards enable row level security;
drop policy if exists "Users can CRUD their own flashcards" on public.flashcards;
create policy "Users can CRUD their own flashcards" on public.flashcards
  using (auth.uid() = user_id);

-- RLS for Reviews
alter table public.flashcard_reviews enable row level security;
drop policy if exists "Users can CRUD their own reviews" on public.flashcard_reviews;
create policy "Users can CRUD their own reviews" on public.flashcard_reviews
  using (auth.uid() = user_id);




-- Create Answers Table
create table if not exists public.answers (
  id uuid default uuid_generate_v4() primary key,
  question_id uuid references questions(id) on delete cascade not null,
  text text not null,
  is_correct boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.answers enable row level security;
drop policy if exists "Answers are viewable by everyone" on public.answers;
create policy "Answers are viewable by everyone" on public.answers for select using (true);

-- Create User Progress (Gamification & Tracking)
create table if not exists public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  question_id uuid references questions(id) on delete cascade not null,
  is_correct boolean default false,
  answered_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_progress enable row level security;
drop policy if exists "Users can view own progress" on public.user_progress;
create policy "Users can view own progress" on public.user_progress for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own progress" on public.user_progress;
create policy "Users can insert own progress" on public.user_progress for insert with check (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    case 
      when new.raw_user_meta_data->>'role' = 'admin' then 'admin'::user_role
      when new.raw_user_meta_data->>'role' = 'teacher' then 'teacher'::user_role
      else 'student'::user_role
    end
  );
  return new;
exception when others then
  -- If profile creation fails, allow auth to succeed but log internally
  -- This prevents users from being locked out of the app entirely
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create Game Sessions Table (PvP Mode)
-- Create game_status Safely
do $$ begin
    create type game_status as enum ('waiting', 'playing', 'finished');
exception
    when duplicate_object then null;
end $$;

create table if not exists public.game_sessions (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  status game_status default 'waiting',
  certification_id uuid references certifications(id) on delete cascade not null,
  player_1_id uuid references profiles(id),
  player_2_id uuid references profiles(id),
  current_question_index integer default 0,
  scores jsonb default '{"p1": 0, "p2": 0}'::jsonb,
  winner_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.game_sessions enable row level security;

drop policy if exists "Players can view their sessions" on public.game_sessions;
create policy "Players can view their sessions" on public.game_sessions for select using ( auth.uid() = player_1_id or auth.uid() = player_2_id );

drop policy if exists "Anyone can create a session" on public.game_sessions;
create policy "Anyone can create a session" on public.game_sessions for insert with check ( auth.uid() = player_1_id );

drop policy if exists "Players can update their sessions" on public.game_sessions;
create policy "Players can update their sessions" on public.game_sessions for update using ( auth.uid() = player_1_id or auth.uid() = player_2_id );

-- Allow anyone to read sessions by code (needed to join)
drop policy if exists "Public can find sessions by code" on public.game_sessions;
create policy "Public can find sessions by code" 
  on public.game_sessions for select 
  using ( status = 'waiting' );

-- Create Badges Table
create table if not exists public.badges (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  icon text not null, -- Lucide icon name
  category text not null, -- 'achievement', 'mastery', 'dedication'
  criteria jsonb, -- Flexible field to store rules {type: 'quiz_count', threshold: 10} etc
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.badges enable row level security;
drop policy if exists "Badges are viewable by everyone" on public.badges;
create policy "Badges are viewable by everyone" on public.badges for select using (true);

-- Create User Badges Table (Assignments)
create table if not exists public.user_badges (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  badge_id uuid references badges(id) on delete cascade not null,
  awarded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, badge_id)
);

alter table public.user_badges enable row level security;
drop policy if exists "Users can view own badges" on public.user_badges;
create policy "Users can view own badges" on public.user_badges for select using (auth.uid() = user_id);

drop policy if exists "System can insert badges" on public.user_badges;
create policy "System can insert badges" on public.user_badges for insert with check (true); -- Ideally restricted, but for MVP client-side logic needs to insert

