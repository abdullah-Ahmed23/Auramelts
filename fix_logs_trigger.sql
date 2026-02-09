-- ============================================================
-- FIX ACTIVITY LOGS TRIGGER (DEBUG & REPAIR)
-- Run this if logs are not appearing after order creation
-- ============================================================

-- 1. Ensure user_id is NULLABLE (Critical for Guest Checkout)
ALTER TABLE activity_logs ALTER COLUMN user_id DROP NOT NULL;

-- 2. Grant Permissions to Service Role (Edge Function uses this)
GRANT INSERT ON activity_logs TO service_role;
GRANT SELECT ON activity_logs TO service_role;

-- 3. Update Trigger Function to Handle Guests Gracefully
CREATE OR REPLACE FUNCTION public.log_new_order()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Attempt to get user_id, but handle if it's null (Guest)
  -- func auth.uid() returns null if called by service_role without a user token context
  -- But we might have a user_id in the order if they were logged in? 
  -- The orders table doesn't seem to have a user_id column based on previous SQL? 
  -- If it does, utilize it. If not, use auth.uid() which might be null.
  
  v_user_id := auth.uid();
  
  INSERT INTO public.activity_logs (action, details, action_type, user_id, user_email, user_name)
  VALUES (
    'New Order',
    'Order #' || NEW.id || ' placed by ' || NEW.customer_name,
    'create',
    v_user_id, 
    NEW.customer_email,
    NEW.customer_name
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Last resort: Don't fail the order if logging fails
  RAISE WARNING 'Failed to log order activity: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-attach Trigger (Just to be sure)
DROP TRIGGER IF EXISTS on_order_created ON orders;
CREATE TRIGGER on_order_created
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION public.log_new_order();

-- 5. Insert a Test Log Manually to Verify Table is Writeable
-- This attempts to insert a log directly. If this fails, the table itself is locked.
-- We use DO block to catch error if any
DO $$
BEGIN
  INSERT INTO activity_logs (action, details, action_type, user_name)
  VALUES ('System Check', 'Verifying Activity Logs Write Access', 'system', 'System Admin');
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Manual log insert failed: %', SQLERRM;
END $$;
