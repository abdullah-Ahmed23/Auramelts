
-- 1. Add payment_proof column (Safe to run multiple times)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_proof TEXT;

-- 2. Create Storage Bucket (Try to create, ignore if fails/exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies (These might fail if you are not the owner)
-- Better approach: Create them if they don't exist, wrapped in a DO block if possible, 
-- but straightforward creation is standard. If these fail with 42501, 
-- please create the 'payment-proofs' bucket Manually in Supabase Dashboard -> Storage.

BEGIN;
  -- Remove existing policies to avoid conflicts if re-running
  DROP POLICY IF EXISTS "Public View Payment Proofs" ON storage.objects;
  DROP POLICY IF EXISTS "Public Upload Payment Proofs" ON storage.objects;

  -- Policy: Allow Public Read (View Proofs)
  CREATE POLICY "Public View Payment Proofs"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'payment-proofs' );

  -- Policy: Allow Public Upload (Checkout)
  CREATE POLICY "Public Upload Payment Proofs"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'payment-proofs' );
COMMIT;
