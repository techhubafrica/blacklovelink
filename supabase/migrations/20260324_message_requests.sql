-- Migration: Add intro_text to swipes table to support Message Requests
ALTER TABLE public.swipes
ADD COLUMN IF NOT EXISTS intro_text TEXT;
