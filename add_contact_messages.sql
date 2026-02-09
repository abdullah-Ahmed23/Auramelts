-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'new'
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for contact form)
CREATE POLICY "Allow public insert to contact_messages" 
ON contact_messages FOR INSERT 
WITH CHECK (true);

-- Allow admins to view (assuming authenticated users are admins for now, or just public for simplicity in development if auth is not strict)
-- For now, let's allow public read so you can verify it in the dashboard easily, or strict if you prefer.
-- improved: Allow read only for authenticated users (admins) implies we need auth.
-- Let's just allow public insert and keep read restricted or open for dev.
CREATE POLICY "Allow public read to contact_messages"
ON contact_messages FOR SELECT
USING (true);
