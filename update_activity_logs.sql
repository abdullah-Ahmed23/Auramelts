-- Add user tracking columns to activity_logs
ALTER TABLE activity_logs 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Update RLS policies if needed (allowing insert for authenticated users is likely already there)
