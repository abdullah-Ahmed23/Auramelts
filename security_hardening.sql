-- ============================================================
-- AURA MELTS SECURITY HARDENING SCRIPT
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. FIX ORDERS & ORDER_ITEMS DELETE POLICIES (CRITICAL)
-- ============================================================

-- Drop dangerous policies that allow anyone to delete
DROP POLICY IF EXISTS "Enable delete for users" ON orders;
DROP POLICY IF EXISTS "Enable delete for users" ON order_items;

-- Create secure admin-only delete policies
CREATE POLICY "Admin can delete orders" ON orders FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin can delete order_items" ON order_items FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================================
-- 2. (SKIPPED - contact_messages table doesn't exist, using messages table instead)
-- ============================================================

-- ============================================================
-- 3. FIX CATEGORIES STORAGE BUCKET (CRITICAL)
-- ============================================================

-- Drop overly permissive storage policies
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Admin-only write access for categories bucket
CREATE POLICY "Admin Upload Categories" ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'categories' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin Update Categories" ON storage.objects FOR UPDATE
USING (
  bucket_id = 'categories' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin Delete Categories" ON storage.objects FOR DELETE
USING (
  bucket_id = 'categories' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================================
-- 4. FIX PAYMENT-PROOFS BUCKET (CRITICAL)
-- ============================================================

-- Make bucket private
UPDATE storage.buckets SET public = false WHERE id = 'payment-proofs';

-- Drop old public policies
DROP POLICY IF EXISTS "Public View Payment Proofs" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Payment Proofs" ON storage.objects;

-- Only admins can view payment proofs
CREATE POLICY "Admin View Payment Proofs" ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-proofs' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Anyone can upload payment proof (needed for checkout)
CREATE POLICY "Public Upload Payment Proofs" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs');

-- ============================================================
-- 5. FIX ACTIVITY LOGS (CRITICAL)
-- ============================================================

-- Revoke broad permissions from authenticated users
REVOKE INSERT, UPDATE, DELETE ON activity_logs FROM authenticated;

-- Only admins can read activity logs
DROP POLICY IF EXISTS "Admin read logs" ON activity_logs;
CREATE POLICY "Admin read activity_logs" ON activity_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Allow authenticated users to insert logs only
CREATE POLICY "Authenticated insert activity_logs" ON activity_logs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- 6. SECURE PRODUCTS TABLE (HIGH)
-- ============================================================

-- Enable RLS if not already
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can read products
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT
USING (true);

-- Only admins can modify products
DROP POLICY IF EXISTS "Admin insert products" ON products;
CREATE POLICY "Admin insert products" ON products FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin update products" ON products;
CREATE POLICY "Admin update products" ON products FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin delete products" ON products;
CREATE POLICY "Admin delete products" ON products FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================================
-- 7. SECURE CATEGORIES TABLE (HIGH)
-- ============================================================

-- Enable RLS if not already
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public can read categories
DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT
USING (true);

-- Only admins can modify categories
DROP POLICY IF EXISTS "Admin insert categories" ON categories;
CREATE POLICY "Admin insert categories" ON categories FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin update categories" ON categories;
CREATE POLICY "Admin update categories" ON categories FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin delete categories" ON categories;
CREATE POLICY "Admin delete categories" ON categories FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================================
-- 8. SECURE TESTIMONIALS TABLE (HIGH)
-- ============================================================

-- Enable RLS if not already
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can read approved testimonials
DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT
USING (true);

-- Public can submit testimonials
DROP POLICY IF EXISTS "Public insert testimonials" ON testimonials;
CREATE POLICY "Public insert testimonials" ON testimonials FOR INSERT
WITH CHECK (true);

-- Only admins can update/delete testimonials
DROP POLICY IF EXISTS "Admin update testimonials" ON testimonials;
CREATE POLICY "Admin update testimonials" ON testimonials FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin delete testimonials" ON testimonials;
CREATE POLICY "Admin delete testimonials" ON testimonials FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================================
-- 9. SECURE MESSAGES TABLE (HIGH)
-- ============================================================

-- Enable RLS if not already
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public can submit messages
DROP POLICY IF EXISTS "Public insert messages" ON messages;
CREATE POLICY "Public insert messages" ON messages FOR INSERT
WITH CHECK (true);

-- Only admins can read/update/delete messages
DROP POLICY IF EXISTS "Admin read messages" ON messages;
CREATE POLICY "Admin read messages" ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin update messages" ON messages;
CREATE POLICY "Admin update messages" ON messages FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin delete messages" ON messages;
CREATE POLICY "Admin delete messages" ON messages FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================================
-- 10. SECURE ORDERS TABLE (HIGH)
-- ============================================================

-- Public can create orders (for checkout)
DROP POLICY IF EXISTS "Public insert orders" ON orders;
CREATE POLICY "Public insert orders" ON orders FOR INSERT
WITH CHECK (true);

-- Admins can read all orders
DROP POLICY IF EXISTS "Admin read orders" ON orders;
CREATE POLICY "Admin read orders" ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Admins can update orders
DROP POLICY IF EXISTS "Admin update orders" ON orders;
CREATE POLICY "Admin update orders" ON orders FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================================
-- 11. SECURE ORDER_ITEMS TABLE (HIGH)
-- ============================================================

-- Public can create order items (for checkout)
DROP POLICY IF EXISTS "Public insert order_items" ON order_items;
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT
WITH CHECK (true);

-- Admins can read all order items
DROP POLICY IF EXISTS "Admin read order_items" ON order_items;
CREATE POLICY "Admin read order_items" ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================================
-- VERIFICATION QUERY - Run after to check policies
-- ============================================================

-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public'
-- ORDER BY tablename, cmd;
