-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  occupation_title TEXT NOT NULL DEFAULT '',
  occupation_company TEXT NOT NULL DEFAULT '',
  dob DATE,
  age INTEGER,
  gender TEXT,
  intent TEXT,
  interests TEXT[] DEFAULT '{}',
  bio TEXT DEFAULT '',
  photos TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can read profiles (for swipe cards)
CREATE POLICY "Profiles are publicly readable" ON public.profiles
  FOR SELECT USING (true);

-- Users can only insert/update their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create a storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) 
  VALUES ('profile-photos', 'profile-photos', true)
  ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload profile photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-photos');

-- Allow public read access to profile photos
CREATE POLICY "Profile photos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

-- Allow users to update/delete their own photos
CREATE POLICY "Users can manage their own photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
