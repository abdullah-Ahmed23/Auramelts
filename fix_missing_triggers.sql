-- ============================================================
-- FIX MISSING LOG TRIGGERS
-- You noticed "messages" and "feedback" weren't showing in logs.
-- This is because I disabled client-side logging but didn't add triggers for them yet!
-- ============================================================

-- 1. Trigger for New Messages (Contact Form)
CREATE OR REPLACE FUNCTION public.log_new_message()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_logs (action, details, action_type, user_id, user_email, user_name)
  VALUES (
    'New Message',
    'From: ' || NEW.email || ' - Subject: ' || NEW.subject,
    'create',
    auth.uid(), -- Might be null (guest)
    NEW.email,
    NEW.name
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_message_created ON messages;
CREATE TRIGGER on_message_created
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION public.log_new_message();

-- 2. Trigger for New Feedback
CREATE OR REPLACE FUNCTION public.log_new_feedback()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_logs (action, details, action_type, user_id, user_name)
  VALUES (
    'New Feedback',
    'Rating: ' || NEW.rating || '/5 - ' || left(NEW.comment, 50) || '...',
    'create',
    auth.uid(),
    NEW.name
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_feedback_created ON feedback;
CREATE TRIGGER on_feedback_created
AFTER INSERT ON feedback
FOR EACH ROW
EXECUTE FUNCTION public.log_new_feedback();

-- 3. Trigger for Testimonials
CREATE OR REPLACE FUNCTION public.log_new_testimonial()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_logs (action, details, action_type, user_id, user_name)
  VALUES (
    'New Testimonial',
    'Rating: ' || NEW.rating || '/5 by ' || NEW.name,
    'create',
    auth.uid(),
    NEW.name
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_testimonial_created ON testimonials;
CREATE TRIGGER on_testimonial_created
AFTER INSERT ON testimonials
FOR EACH ROW
EXECUTE FUNCTION public.log_new_testimonial();
