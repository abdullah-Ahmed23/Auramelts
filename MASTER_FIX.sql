-- ==========================================
-- AURA MELTS MASTER DATABASE FIX
-- Run this ENTIRE script in Supabase SQL Editor
-- ==========================================

-- 1. FIX ORDERS TABLE SCHEMA (Add Governorate/City)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS governorate TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

-- 2. FIX ACTIVITY LOGS PERMISSIONS (Fixes "Permission Denied")
-- Allow guest users to log storefront activity
GRANT INSERT ON activity_logs TO anon;
GRANT INSERT ON activity_logs TO authenticated;

-- Update RLS policy to allow anyone to insert logs
DROP POLICY IF EXISTS "Authenticated insert activity_logs" ON activity_logs;
DROP POLICY IF EXISTS "Public insert activity_logs" ON activity_logs;
CREATE POLICY "Public insert activity_logs" ON activity_logs FOR INSERT
WITH CHECK (true);
