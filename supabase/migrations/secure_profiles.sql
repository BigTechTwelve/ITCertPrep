-- Secure Profiles: Prevent Role Escalation

-- Function to check role updates
CREATE OR REPLACE FUNCTION check_role_update()
RETURNS TRIGGER AS $$
DECLARE
  current_user_role text;
BEGIN
  -- If usage is from service_role (e.g. seed scripts), allow it
  -- (auth.jwt() is null for service_role usually, or we can check current_setting)
  -- But here we rely on profiles table lookup for "application admin"
  
  -- If the role is not changing, allow it (e.g. updating name/avatar)
  IF NEW.role IS NOT DISTINCT FROM OLD.role THEN
    RETURN NEW;
  END IF;

  -- Role IS changing. Check if the actor is an Admin.
  SELECT role INTO current_user_role
  FROM profiles
  WHERE id = auth.uid();

  -- If actor is NOT admin, deny the change
  IF current_user_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Only administrators can change user roles.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_profile_role_change ON profiles;
CREATE TRIGGER on_profile_role_change
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_role_update();
