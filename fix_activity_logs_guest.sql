-- Fix Activity Logs for Guest Users
-- Allow 'anon' role to insert into activity_logs
GRANT INSERT ON activity_logs TO anon;

-- Update RLS policy to allow any user (including guests) to insert logs
DROP POLICY IF EXISTS "Authenticated insert activity_logs" ON activity_logs;
CREATE POLICY "Public insert activity_logs" ON activity_logs FOR INSERT
WITH CHECK (true);
