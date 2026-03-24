-- 20260324_account_settings.sql

-- Add user preference columns to the profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT true NOT NULL,
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true NOT NULL,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true NOT NULL;

-- Ensure RLS policies allow the user to UPDATE these new columns if needed.
-- (Our existing "Users can update own profile." policy already covers ALL columns for the user)
