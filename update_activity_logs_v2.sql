-- Add user_name column to activity_logs
ALTER TABLE activity_logs 
ADD COLUMN IF NOT EXISTS user_name TEXT;
