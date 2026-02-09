-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO FIX UPLOAD ERRORS

-- 1. Create the 'categories' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop any potentially conflicting policies
DROP POLICY IF EXISTS "Public Select" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- 3. Create OPEN policies for everyone (anon)
-- Allow viewing images
CREATE POLICY "Public Select"
ON storage.objects FOR SELECT
USING ( bucket_id = 'categories' );

-- Allow uploading images (INSERT)
CREATE POLICY "Public Insert"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'categories' );

-- Allow updating/deleting images (optional, but good for admin)
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'categories' );

CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'categories' );
