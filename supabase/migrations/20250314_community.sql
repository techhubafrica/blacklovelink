-- ─────────────────────────────────────────────────────────────────────────────
-- Community Feature Migration
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_anonymous  BOOLEAN NOT NULL DEFAULT false,
  display_name  TEXT,               -- null → use profile full_name; populated if anonymous
  category      TEXT NOT NULL CHECK (category IN ('My Story','Love Advice','Question','Rant','Confession')),
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  heart_count   INTEGER NOT NULL DEFAULT 0,
  report_count  INTEGER NOT NULL DEFAULT 0,
  hidden        BOOLEAN NOT NULL DEFAULT false,   -- auto-hidden when report_count >= 5
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Comments table
CREATE TABLE IF NOT EXISTS public.community_comments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_anonymous  BOOLEAN NOT NULL DEFAULT false,
  display_name  TEXT,
  body          TEXT NOT NULL,
  heart_count   INTEGER NOT NULL DEFAULT 0,
  report_count  INTEGER NOT NULL DEFAULT 0,
  hidden        BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Post hearts (one per user per post)
CREATE TABLE IF NOT EXISTS public.post_hearts (
  post_id   UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);

-- 4. Comment hearts
CREATE TABLE IF NOT EXISTS public.comment_hearts (
  comment_id  UUID NOT NULL REFERENCES public.community_comments(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (comment_id, user_id)
);

-- 5. Post reports
CREATE TABLE IF NOT EXISTS public.post_reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason      TEXT NOT NULL CHECK (reason IN ('Spam','Hate speech','Harassment','Misinformation','Other')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, reporter_id)  -- one report per user per post
);

-- 6. Comment reports
CREATE TABLE IF NOT EXISTS public.comment_reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id  UUID NOT NULL REFERENCES public.community_comments(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason      TEXT NOT NULL CHECK (reason IN ('Spam','Hate speech','Harassment','Misinformation','Other')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (comment_id, reporter_id)
);

-- ─── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE public.community_posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_hearts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_hearts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reports        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reports     ENABLE ROW LEVEL SECURITY;

-- Posts: anyone authenticated can read non-hidden posts
CREATE POLICY "Read visible posts"   ON public.community_posts FOR SELECT USING (auth.role() = 'authenticated' AND hidden = false);
CREATE POLICY "Insert own post"      ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete own post"      ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- Comments: same
CREATE POLICY "Read visible comments" ON public.community_comments FOR SELECT USING (auth.role() = 'authenticated' AND hidden = false);
CREATE POLICY "Insert own comment"    ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete own comment"    ON public.community_comments FOR DELETE USING (auth.uid() = user_id);

-- Hearts
CREATE POLICY "Read hearts"           ON public.post_hearts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Toggle heart"          ON public.post_hearts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Remove heart"          ON public.post_hearts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Read comment hearts"   ON public.comment_hearts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Toggle comment heart"  ON public.comment_hearts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Remove comment heart"  ON public.comment_hearts FOR DELETE USING (auth.uid() = user_id);

-- Reports: anyone can file, no one can read others'
CREATE POLICY "File post report"     ON public.post_reports    FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "File comment report"  ON public.comment_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- ─── Auto-hide trigger (hide post when report_count >= 5) ─────────────────────

CREATE OR REPLACE FUNCTION public.increment_post_report_and_hide()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.community_posts
  SET report_count = report_count + 1,
      hidden = CASE WHEN report_count + 1 >= 5 THEN true ELSE hidden END
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_post_report_insert
  AFTER INSERT ON public.post_reports
  FOR EACH ROW EXECUTE FUNCTION public.increment_post_report_and_hide();

CREATE OR REPLACE FUNCTION public.increment_comment_report_and_hide()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.community_comments
  SET report_count = report_count + 1,
      hidden = CASE WHEN report_count + 1 >= 5 THEN true ELSE hidden END
  WHERE id = NEW.comment_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_comment_report_insert
  AFTER INSERT ON public.comment_reports
  FOR EACH ROW EXECUTE FUNCTION public.increment_comment_report_and_hide();
