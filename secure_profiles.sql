-- ============================================================
-- SECURE PROFILES TABLE (CRITICAL FIX)
-- Prevents Privilege Escalation (users making themselves admins)
-- ============================================================

-- 1. Enable RLS (In case it was disabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Allow Public Read (Needed for UI to show avatars/names)
DROP POLICY IF EXISTS "Public read profiles" ON profiles;
CREATE POLICY "Public read profiles" ON profiles FOR SELECT
USING (true);

-- 3. Allow Users to Update THEIR OWN Profile Only
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. CRITICAL: Prevent Role Changes via Trigger
-- Even if a user updates their profile, this trigger ensures 'role' cannot be changed
-- unless the update relies on the generic service_role key (which the client doesn't have)

CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If the role is being changed
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- And the user is NOT a superuser or service_role
    IF auth.role() = 'authenticated' OR auth.role() = 'anon' THEN
       RAISE EXCEPTION 'You are not authorized to change the user role.';
    END IF;
  END IF;
  return NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_profile_update ON profiles;
CREATE TRIGGER check_profile_update
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_role_change();

-- 5. Allow Users to Insert their own profile (on signup)
DROP POLICY IF EXISTS "Users insert own profile" ON profiles;
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);
