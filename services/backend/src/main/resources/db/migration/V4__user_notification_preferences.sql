-- Add notification preference columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS notify_email_enabled BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notify_class_reminders BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notify_student_enrollments BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notify_marketing_emails BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notify_weekly_digest BOOLEAN DEFAULT true;

-- Update existing users with default values
UPDATE users SET
    notify_email_enabled = COALESCE(notify_email_enabled, true),
    notify_class_reminders = COALESCE(notify_class_reminders, true),
    notify_student_enrollments = COALESCE(notify_student_enrollments, true),
    notify_marketing_emails = COALESCE(notify_marketing_emails, false),
    notify_weekly_digest = COALESCE(notify_weekly_digest, true);
