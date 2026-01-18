-- Hardening Application Security: Function Search Paths & RLS Tightening

-- 1. Fixing Mutable Search Paths for Security Definer Functions
-- This prevents search path hijacking by pinning everything to the public schema.

-- Users & Profiles
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.check_role_update() SET search_path = public;

-- Gamification & Badges
ALTER FUNCTION public.award_badge_if_not_exists(uuid, text) SET search_path = public;
ALTER FUNCTION public.check_badges_on_progress() SET search_path = public;
ALTER FUNCTION public.check_badge_criteria() SET search_path = public;
ALTER FUNCTION public.check_quiz_mastery() SET search_path = public;
ALTER FUNCTION public.check_flashcard_milestones() SET search_path = public;

-- Analytics & RPCs
ALTER FUNCTION public.get_global_analytics() SET search_path = public;
ALTER FUNCTION public.get_class_weaknesses(uuid) SET search_path = public;
ALTER FUNCTION public.get_student_weaknesses(uuid) SET search_path = public;
ALTER FUNCTION public.get_random_questions(uuid[], int) SET search_path = public;
ALTER FUNCTION public.get_pvp_questions(int) SET search_path = public;

-- PvP Logic
ALTER FUNCTION public.validate_pvp_update() SET search_path = public;

-- 2. Tightening RLS for user_badges
-- Direct client-side insert is blocked; awarding must happen via secure server-side functions.
DROP POLICY IF EXISTS "System can insert badges" ON public.user_badges;
DROP POLICY IF EXISTS "Only system can insert badges" ON public.user_badges;

CREATE POLICY "Badge awards are system-managed"
ON public.user_badges
FOR INSERT
WITH CHECK (false);

-- Note: SELECT policy remains unchanged as users should see their own badges.
