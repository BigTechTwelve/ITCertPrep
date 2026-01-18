-- Add code column to classes table
alter table classes 
add column if not exists code text unique default upper(substring(md5(random()::text) from 1 for 6));

-- Create policy to allow students to find classes by code
-- This is necessary for the "Join Class" feature
drop policy if exists "Students can find classes by code" on classes;
create policy "Students can find classes by code"
  on classes for select
  using ( true ); -- Already have "Classes are viewable by everyone" but explicitly good to know intent

-- Ensure enrollments are insertable by students joining a class
drop policy if exists "Students can enroll themselves" on class_enrollments;
create policy "Students can enroll themselves"
  on class_enrollments for insert
  with check ( auth.uid() = student_id );
