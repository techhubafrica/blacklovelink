-- Enable realtime for matches table so both users see new matches instantly
-- Safe to run even if messages table is already published
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
