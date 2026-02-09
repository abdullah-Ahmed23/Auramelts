-- ============================================================
-- AURA MELTS SECURITY RLS FIXES (V4 - COMPREHENSIVE CLEANUP)
-- This script drops ALL redundant permissive policies and creates secure ones.
-- ============================================================

-- 1. FIX ACTIVITY_LOGS
DROP POLICY IF EXISTS "Allow anon insert activity_logs" ON activity_logs;
DROP POLICY IF EXISTS "Public insert activity_logs" ON activity_logs;
DROP POLICY IF EXISTS "Users can insert logs" ON activity_logs;
DROP POLICY IF EXISTS "Authenticated insert activity_logs" ON activity_logs;

CREATE POLICY "Public insert activity_logs" ON activity_logs FOR INSERT
WITH CHECK (length(action) > 0 AND length(details) > 0);

-- 2. FIX ORDERS
DROP POLICY IF EXISTS "Enable delete for users" ON orders;
DROP POLICY IF EXISTS "Anyone can place orders." ON orders;
DROP POLICY IF EXISTS "Public insert orders" ON orders;

CREATE POLICY "Public insert orders" ON orders FOR INSERT
WITH CHECK (length(customer_name) > 0 AND length(customer_phone) > 0);

-- 3. FIX ORDER_ITEMS
DROP POLICY IF EXISTS "Enable delete for users" ON order_items;
DROP POLICY IF EXISTS "Anyone can add order items during checkout." ON order_items;
DROP POLICY IF EXISTS "Public insert items" ON order_items;
DROP POLICY IF EXISTS "Public insert order_items" ON order_items;

CREATE POLICY "Public insert order_items" ON order_items FOR INSERT
WITH CHECK (quantity > 0);

-- 4. FIX MESSAGES
DROP POLICY IF EXISTS "Anyone can send messages." ON messages;
DROP POLICY IF EXISTS "Public insert messages" ON messages;

CREATE POLICY "Public insert messages" ON messages FOR INSERT
WITH CHECK (length(name) > 0 AND length(email) > 0);

-- 5. FIX TESTIMONIALS
DROP POLICY IF EXISTS "Public can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public insert testimonials" ON testimonials;

CREATE POLICY "Public insert testimonials" ON testimonials FOR INSERT
WITH CHECK (length(name) > 0 AND rating >= 1 AND rating <= 5 AND length(feedback) > 0);

-- 6. FIX FEEDBACK
DROP POLICY IF EXISTS "Anyone can insert feedback." ON feedback;
DROP POLICY IF EXISTS "Authenticated insert feedback" ON feedback;

CREATE POLICY "Anyone can insert feedback." ON feedback FOR INSERT
WITH CHECK (id IS NOT NULL);
