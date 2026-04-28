-- 20260428_message_features.sql
-- Adds edit, unsend (soft-delete), and reply-to support for Instagram-style messaging

-- 1. Add new columns to messages table
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reply_to UUID REFERENCES public.messages(id) ON DELETE SET NULL;

-- 2. Allow users to UPDATE their own messages (for edit and unsend)
-- Drop existing policy if exists to avoid conflicts
DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;

CREATE POLICY "Users can update own messages"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (
    sender_id = auth.uid()
    AND public.is_match_member(auth.uid(), match_id)
  )
  WITH CHECK (
    sender_id = auth.uid()
    AND public.is_match_member(auth.uid(), match_id)
  );

-- 3. Update the mutual-like trigger to also handle 'message' direction swipes
-- This ensures that if User A swipes right on User B, and User B sends a message request
-- to User A, a match is still created.
CREATE OR REPLACE FUNCTION public.check_mutual_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _match_exists BOOLEAN;
  _a UUID;
  _b UUID;
BEGIN
  -- Only process positive interactions (right, up, or message)
  IF NEW.direction NOT IN ('right', 'up', 'message') THEN
    RETURN NEW;
  END IF;

  -- Check if the other person also swiped right/up/message on this user
  IF EXISTS (
    SELECT 1 FROM public.swipes
    WHERE swiper_id = NEW.swiped_id
    AND swiped_id = NEW.swiper_id
    AND direction IN ('right', 'up', 'message')
  ) THEN
    -- Ensure consistent ordering
    IF NEW.swiper_id < NEW.swiped_id THEN
      _a := NEW.swiper_id;
      _b := NEW.swiped_id;
    ELSE
      _a := NEW.swiped_id;
      _b := NEW.swiper_id;
    END IF;

    -- Insert match if not exists
    INSERT INTO public.matches (user_a, user_b)
    VALUES (_a, _b)
    ON CONFLICT (user_a, user_b) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- 4. Also allow users to read swipes where they are the target (for the Likes page)
-- This is needed so users can see who liked them
DROP POLICY IF EXISTS "Users can read incoming swipes" ON public.swipes;
CREATE POLICY "Users can read incoming swipes"
  ON public.swipes FOR SELECT
  TO authenticated
  USING (swiped_id = auth.uid());
