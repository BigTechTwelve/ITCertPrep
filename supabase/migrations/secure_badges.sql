-- Secure Badges Logic

-- 1. Helper function to safely award a badge
create or replace function public.award_badge_if_not_exists(p_user_id uuid, p_badge_name text)
returns void as $$
declare
  v_badge_id uuid;
begin
  -- Find badge ID by name
  select id into v_badge_id from public.badges where name = p_badge_name limit 1;
  
  -- If badge exists and user doesn't have it, insert it
  if v_badge_id is not null then
    if not exists (select 1 from public.user_badges where user_id = p_user_id and badge_id = v_badge_id) then
        insert into public.user_badges (user_id, badge_id)
        values (p_user_id, v_badge_id);
    end if;
  end if;
end;
$$ language plpgsql security definer;

-- 2. Trigger function to check progress
create or replace function public.check_badges_on_progress()
returns trigger as $$
declare
  v_correct_count integer;
begin
  -- Count total correct answers for this user
  select count(*) into v_correct_count
  from public.user_progress
  where user_id = new.user_id and is_correct = true;

  -- "First Steps": Awarded on 1st correct answer
  if v_correct_count >= 1 then
    perform public.award_badge_if_not_exists(new.user_id, 'First Steps');
  end if;

  -- "High Flyer": Awarded on 10 correct answers
  if v_correct_count >= 10 then
    perform public.award_badge_if_not_exists(new.user_id, 'High Flyer');
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- 3. Create Trigger
drop trigger if exists on_progress_award_badges on public.user_progress;
create trigger on_progress_award_badges
  after insert on public.user_progress
  for each row execute procedure public.check_badges_on_progress();

-- 4. Lock down RLS
-- Drop the permissive policy if it exists (try/catch style not needed in raw SQL if we know the name, but being safe)
drop policy if exists "System can insert badges" on public.user_badges;

-- Create restrictive policy (Only allows admins or service role to insert, which functions bypass if security definer)
create policy "Only system can insert badges" 
  on public.user_badges 
  for insert 
  with check (false); -- Effectively blocks client-side usage, requiring server-side or function-based insertion
