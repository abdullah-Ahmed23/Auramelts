-- Ensure all columns exist for activity_logs
ALTER TABLE activity_logs 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS user_name TEXT;

-- Grant permissions just in case
GRANT INSERT, SELECT, UPDATE, DELETE ON activity_logs TO authenticated;
GRANT INSERT, SELECT, UPDATE, DELETE ON activity_logs TO service_role;
