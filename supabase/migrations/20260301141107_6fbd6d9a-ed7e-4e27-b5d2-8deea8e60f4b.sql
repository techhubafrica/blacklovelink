
-- 1. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  occupation_title TEXT NOT NULL DEFAULT '',
  occupation_company TEXT NOT NULL DEFAULT '',
  dob DATE,
  age INT,
  gender TEXT,
  intent TEXT,
  interests TEXT[] DEFAULT '{}',
  bio TEXT NOT NULL DEFAULT '',
  photos TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  profile_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read completed profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (profile_completed = true OR user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 2. Swipes table
CREATE TABLE public.swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  swiped_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('left', 'right', 'up')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (swiper_id, swiped_id)
);

ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own swipes"
  ON public.swipes FOR INSERT
  TO authenticated
  WITH CHECK (swiper_id = auth.uid());

CREATE POLICY "Users can read own swipes"
  ON public.swipes FOR SELECT
  TO authenticated
  USING (swiper_id = auth.uid());

-- 3. Matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_a, user_b)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own matches"
  ON public.matches FOR SELECT
  TO authenticated
  USING (user_a = auth.uid() OR user_b = auth.uid());

CREATE POLICY "System can insert matches"
  ON public.matches FOR INSERT
  TO authenticated
  WITH CHECK (user_a = auth.uid() OR user_b = auth.uid());

-- 4. Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Function to check match membership
CREATE OR REPLACE FUNCTION public.is_match_member(_user_id UUID, _match_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.matches
    WHERE id = _match_id
    AND (user_a = _user_id OR user_b = _user_id)
  )
$$;

CREATE POLICY "Users can read messages in their matches"
  ON public.messages FOR SELECT
  TO authenticated
  USING (public.is_match_member(auth.uid(), match_id));

CREATE POLICY "Users can send messages in their matches"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid() AND public.is_match_member(auth.uid(), match_id));

CREATE POLICY "Users can mark messages as read"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (public.is_match_member(auth.uid(), match_id))
  WITH CHECK (public.is_match_member(auth.uid(), match_id));

-- 5. Success stories table
CREATE TABLE public.success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_names TEXT NOT NULL,
  story TEXT NOT NULL,
  photo_url TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved stories"
  ON public.success_stories FOR SELECT
  USING (approved = true);

-- 6. Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- 7. Storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars');

-- 8. Auto-create match on mutual like
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
  IF NEW.direction != 'right' AND NEW.direction != 'up' THEN
    RETURN NEW;
  END IF;

  -- Check if the other person also swiped right/up on this user
  IF EXISTS (
    SELECT 1 FROM public.swipes
    WHERE swiper_id = NEW.swiped_id
    AND swiped_id = NEW.swiper_id
    AND direction IN ('right', 'up')
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

CREATE TRIGGER on_swipe_check_match
AFTER INSERT ON public.swipes
FOR EACH ROW
EXECUTE FUNCTION public.check_mutual_like();
