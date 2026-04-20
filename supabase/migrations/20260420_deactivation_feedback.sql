-- Add columns for the deactivation and deletion flow
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS scheduled_deletion_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS leave_reason TEXT,
  ADD COLUMN IF NOT EXISTS leave_feedback TEXT,
  ADD COLUMN IF NOT EXISTS deletion_requested BOOLEAN DEFAULT false;

-- Allow users to update their own deactivation details
-- This relies on the existing update policy 'Users can update own profile' 
-- but explicitly ensures these fields are safe for them to touch.
