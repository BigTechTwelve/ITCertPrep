-- Update the handle_new_user function to respect the role passed in user_metadata
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
  return new;
end;
$$ language plpgsql security definer;
