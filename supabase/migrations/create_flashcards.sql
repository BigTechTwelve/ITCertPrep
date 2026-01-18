-- Create Flashcards Table
create table if not exists flashcards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  question_id uuid references questions(id), -- Optional link to original question
  front text not null,
  back text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Flashcard Reviews Table (for SRS)
create table if not exists flashcard_reviews (
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
alter table flashcards enable row level security;
drop policy if exists "Users can CRUD their own flashcards" on flashcards;
create policy "Users can CRUD their own flashcards" on flashcards
  using (auth.uid() = user_id);

-- RLS for Reviews
alter table flashcard_reviews enable row level security;
drop policy if exists "Users can CRUD their own reviews" on flashcard_reviews;
create policy "Users can CRUD their own reviews" on flashcard_reviews
  using (auth.uid() = user_id);
