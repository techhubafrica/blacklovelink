-- 02_demo_profiles.sql
-- Run this in your Supabase SQL Editor AFTER running 01_demo_auth_users.sql.

INSERT INTO public.profiles (user_id, full_name, age, gender, occupation_title, occupation_company, profile_completed, verified, photos, intent, interests, bio)
VALUES
  -- Amara Osei
  (
    'd0b6e6b4-20d0-4cca-9860-25232a5df977', 'Amara Osei', 28, 'female', 'Marketing Director', 'Accra Tech', true, true,
    ARRAY['https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/amara-osei/profile.jpg?v=2', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/amara-osei/photo-2.jpg?v=2', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/amara-osei/photo-3.jpg?v=2', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/amara-osei/photo-4.jpg?v=2'],
    'dating', ARRAY['Reading', 'Travel', 'Art'], 'I love exploring new cities and reading a good book on a Sunday morning.'
  ),
  -- Zara Mensah
  (
    'd1b6e6b4-20d0-4cca-9860-25232a5df977', 'Zara Mensah', 31, 'female', 'Architect', 'Urban Designs', true, true,
    ARRAY['https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/zara-mensah/profile.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/zara-mensah/photo-2.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/zara-mensah/photo-3.jpg'],
    'dating', ARRAY['Design', 'Photography', 'Coffee'], 'Architecture by day, amateur photographer by night. Always looking for the perfect cup of coffee.'
  ),
  -- Leila Kamara
  (
    'd2b6e6b4-20d0-4cca-9860-25232a5df977', 'Leila Kamara', 26, 'female', 'Nurse Practitioner', 'City Hospital', true, true,
    ARRAY['https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/leila-kamara/profile.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/leila-kamara/photo-2.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/leila-kamara/photo-3.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/leila-kamara/photo-4.jpg'],
    'dating', ARRAY['Cooking', 'Fitness', 'Music'], 'Passionate about healthcare and helping others. Let''s cook something amazing together.'
  ),
  -- Nia Adeyemi
  (
    'd3b6e6b4-20d0-4cca-9860-25232a5df977', 'Nia Adeyemi', 33, 'female', 'Financial Analyst', 'Global Finance', true, true,
    ARRAY['https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/nia-adeyemi/profile.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/nia-adeyemi/photo-2.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/nia-adeyemi/photo-3.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/nia-adeyemi/photo-4.jpg'],
    'friendship', ARRAY['Investing', 'Yoga', 'Wine'], 'Looking for genuine connections and someone to share a glass of wine with after a long week.'
  ),
  -- Simone Nkosi (Male)
  (
    'd4b6e6b4-20d0-4cca-9860-25232a5df977', 'Simone Nkosi', 29, 'male', 'Software Engineer', 'Tech Innovators', true, true,
    ARRAY['https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/simone-nkosi/profile.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/simone-nkosi/photo-2.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/simone-nkosi/photo-3.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/simone-nkosi/photo-4.jpg'],
    'dating', ARRAY['Coding', 'Gaming', 'Hiking'], 'Tech enthusiast and outdoors lover. Balancing screen time with trail time.'
  ),
  -- Kofi Asante (Female)
  (
    'd5b6e6b4-20d0-4cca-9860-25232a5df977', 'Kofi Asante', 30, 'female', 'Product Manager', 'Creative Solutions', true, true,
    ARRAY['https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/kofi-asante/profile.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/kofi-asante/photo-2.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/kofi-asante/photo-3.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/kofi-asante/photo-4.jpg'],
    'dating', ARRAY['Productivity', 'Podcasts', 'Cycling'], 'Driven by innovation. I love long bike rides, engaging podcasts, and bringing ideas to life.'
  ),
  -- Darius Wright (Male, age 58)
  (
    'd6b6e6b4-20d0-4cca-9860-25232a5df977', 'Darius Wright', 58, 'male', 'Lawyer', 'Wright & Partners', true, true,
    ARRAY['https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/darius-wright/profile.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/darius-wright/photo-2.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/darius-wright/photo-3.jpg', 'https://hxiycmrlyswwjqlwihdd.supabase.co/storage/v1/object/public/profile-photos/demo/darius-wright/photo-4.jpg'],
    'friendship', ARRAY['Law', 'Golf', 'Fine Dining'], 'Experienced professional who enjoys golf on the weekends and a nice restaurant on a Friday night.'
  )
ON CONFLICT (user_id) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  age = EXCLUDED.age,
  gender = EXCLUDED.gender,
  occupation_title = EXCLUDED.occupation_title,
  occupation_company = EXCLUDED.occupation_company,
  profile_completed = EXCLUDED.profile_completed,
  verified = EXCLUDED.verified,
  photos = EXCLUDED.photos,
  intent = EXCLUDED.intent,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio;
