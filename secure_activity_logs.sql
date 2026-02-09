-- ============================================================
-- SECURE ACTIVITY LOGS (SPAM PREVENTION)
-- Stop client-side logging. Use Database Triggers instead.
-- ============================================================

-- 1. REVOKE Public/Anon Insert Permissions
-- This stops the "infinite spam" attack on your logs
REVOKE INSERT ON activity_logs FROM anon;
REVOKE INSERT ON activity_logs FROM authenticated;

-- 2. Drop Insecure Policies
DROP POLICY IF EXISTS "Public insert activity_logs" ON activity_logs;
DROP POLICY IF EXISTS "Authenticated insert activity_logs" ON activity_logs;
DROP POLICY IF EXISTS "Anyone can insert feedback." ON activity_logs; -- Cleanup

-- 3. Create Trigger Function to Auto-Log Orders
CREATE OR REPLACE FUNCTION public.log_new_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_logs (action, details, action_type, user_id, user_email, user_name)
  VALUES (
    'New Order',
    'Order #' || NEW.id || ' placed by ' || NEW.customer_name,
    'create',
    auth.uid(), -- Will be null for guest checkout, which is fine
    NEW.customer_email,
    NEW.customer_name
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Attach Trigger to Orders Table
DROP TRIGGER IF EXISTS on_order_created ON orders;
CREATE TRIGGER on_order_created
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION public.log_new_order();

-- 5. Create Trigger Function to Auto-Log Signups (Profiles)
CREATE OR REPLACE FUNCTION public.log_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_logs (action, details, action_type, user_id, user_email, user_name)
  VALUES (
    'User Signup',
    'New user registered: ' || NEW.email,
    'create',
    NEW.id,
    NEW.email,
    NEW.full_name
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Attach Trigger to Profiles Table
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION public.log_new_user();

-- 7. Admin Read Access (Keep this)
DROP POLICY IF EXISTS "Admin read activity_logs" ON activity_logs;
CREATE POLICY "Admin read activity_logs" ON activity_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
