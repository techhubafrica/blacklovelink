-- 20260324_account_deletion.sql

-- Create a secure function for users to delete their own accounts
-- This must run with SECURITY DEFINER to bypass RLS and allow a user to delete their row from the secure auth.users table.
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Delete the caller's user record in auth.users
  -- Because all other tables (profiles, swipes, matches, etc.) have ON DELETE CASCADE
  -- tied to auth.users.id, PostgreSQL will automatically clean up all their data.
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- Ensure the function is executable by authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;
