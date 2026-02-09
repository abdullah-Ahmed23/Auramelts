-- ============================================================
-- FIX ADMIN PERMISSIONS (RESTORE DELETE ACCESS)
-- I locked down the logs table too tightly. This restores Admin power.
-- ============================================================

-- 1. Grant DELETE permission to Authenticated users (so RLS can be checked)
GRANT DELETE ON activity_logs TO authenticated;

-- 2. Create RLS Policy: Only Admins can DELETE logs
DROP POLICY IF EXISTS "Admin delete activity_logs" ON activity_logs;
CREATE POLICY "Admin delete activity_logs" ON activity_logs FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 3. Also ensure Admins can Update if needed (unlikely for logs, but good practice)
-- GRANT UPDATE ON activity_logs TO authenticated;
-- ... (Update policy omitted unless requested, logs should be immutable)
