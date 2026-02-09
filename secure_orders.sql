-- ============================================================
-- SECURE ORDERS TABLE (LOCKDOWN)
-- Run this AFTER deploying the 'create-order' Edge Function
-- ============================================================

-- 1. Revoke Public/Anon Inserts
-- This forces all new orders to go through the Edge Function (which checks CAPTCHA)
REVOKE INSERT ON orders FROM anon;
REVOKE INSERT ON orders FROM authenticated;

-- 2. Drop Any Remaining Permissive Policies
DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Anyone can place orders." ON orders; -- Cleanup old ones

-- 3. Cleanup Order Items (Cascading Security)
-- Users shouldn't be able to insert items directly either
REVOKE INSERT ON order_items FROM anon;
REVOKE INSERT ON order_items FROM authenticated;

DROP POLICY IF EXISTS "Public insert order_items" ON order_items;

-- 4. Verify Admin Access Still Works
-- (Already handled by "Admin read/update/delete" policies, but good to double check)
-- Admins use the authenticated role but typically read/update via the Dashboard or Admin UI.
-- If Admin UI inserts orders directly (e.g. manual order entry), it might need a specific policy.
-- Assuming Admin UI uses the SAME Edge Function or has a separate admin flow. 
-- For now, we assume Admin UI reads/updates, but doesn't create orders often. 
-- If Admin NEEDS to create orders, we'd add:

CREATE POLICY "Admin insert orders" ON orders FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin insert order_items" ON order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
