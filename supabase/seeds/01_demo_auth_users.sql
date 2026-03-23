-- 01_demo_auth_users.sql
-- Run this in your Supabase SQL Editor to create the 7 demo user accounts.
-- All passwords are: Demo1234!

-- Insert into auth.users
INSERT INTO auth.users (id, instance_id, role, aud, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES 
  ('d0b6e6b4-20d0-4cca-9860-25232a5df977', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'amara@blacklovelink.test', '$2a$10$w1z9F/D2/7H7B23eI12VHev5p6v6rG1Txg./1cO9k3t6XlE1rV2Vq', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Amara Osei"}', now(), now()),
  ('d1b6e6b4-20d0-4cca-9860-25232a5df977', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'zara@blacklovelink.test', '$2a$10$w1z9F/D2/7H7B23eI12VHev5p6v6rG1Txg./1cO9k3t6XlE1rV2Vq', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Zara Mensah"}', now(), now()),
  ('d2b6e6b4-20d0-4cca-9860-25232a5df977', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'leila@blacklovelink.test', '$2a$10$w1z9F/D2/7H7B23eI12VHev5p6v6rG1Txg./1cO9k3t6XlE1rV2Vq', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Leila Kamara"}', now(), now()),
  ('d3b6e6b4-20d0-4cca-9860-25232a5df977', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nia@blacklovelink.test', '$2a$10$w1z9F/D2/7H7B23eI12VHev5p6v6rG1Txg./1cO9k3t6XlE1rV2Vq', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nia Adeyemi"}', now(), now()),
  ('d4b6e6b4-20d0-4cca-9860-25232a5df977', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'simone@blacklovelink.test', '$2a$10$w1z9F/D2/7H7B23eI12VHev5p6v6rG1Txg./1cO9k3t6XlE1rV2Vq', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Simone Nkosi"}', now(), now()),
  ('d5b6e6b4-20d0-4cca-9860-25232a5df977', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'kofi@blacklovelink.test', '$2a$10$w1z9F/D2/7H7B23eI12VHev5p6v6rG1Txg./1cO9k3t6XlE1rV2Vq', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Kofi Asante"}', now(), now()),
  ('d6b6e6b4-20d0-4cca-9860-25232a5df977', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'darius@blacklovelink.test', '$2a$10$w1z9F/D2/7H7B23eI12VHev5p6v6rG1Txg./1cO9k3t6XlE1rV2Vq', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Darius Wright"}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert into auth.identities to ensure they can log in via email/password normally
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'd0b6e6b4-20d0-4cca-9860-25232a5df977', 'd0b6e6b4-20d0-4cca-9860-25232a5df977', format('{"sub":"%s","email":"%s"}', 'd0b6e6b4-20d0-4cca-9860-25232a5df977', 'amara@blacklovelink.test')::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), 'd1b6e6b4-20d0-4cca-9860-25232a5df977', 'd1b6e6b4-20d0-4cca-9860-25232a5df977', format('{"sub":"%s","email":"%s"}', 'd1b6e6b4-20d0-4cca-9860-25232a5df977', 'zara@blacklovelink.test')::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), 'd2b6e6b4-20d0-4cca-9860-25232a5df977', 'd2b6e6b4-20d0-4cca-9860-25232a5df977', format('{"sub":"%s","email":"%s"}', 'd2b6e6b4-20d0-4cca-9860-25232a5df977', 'leila@blacklovelink.test')::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), 'd3b6e6b4-20d0-4cca-9860-25232a5df977', 'd3b6e6b4-20d0-4cca-9860-25232a5df977', format('{"sub":"%s","email":"%s"}', 'd3b6e6b4-20d0-4cca-9860-25232a5df977', 'nia@blacklovelink.test')::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), 'd4b6e6b4-20d0-4cca-9860-25232a5df977', 'd4b6e6b4-20d0-4cca-9860-25232a5df977', format('{"sub":"%s","email":"%s"}', 'd4b6e6b4-20d0-4cca-9860-25232a5df977', 'simone@blacklovelink.test')::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), 'd5b6e6b4-20d0-4cca-9860-25232a5df977', 'd5b6e6b4-20d0-4cca-9860-25232a5df977', format('{"sub":"%s","email":"%s"}', 'd5b6e6b4-20d0-4cca-9860-25232a5df977', 'kofi@blacklovelink.test')::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), 'd6b6e6b4-20d0-4cca-9860-25232a5df977', 'd6b6e6b4-20d0-4cca-9860-25232a5df977', format('{"sub":"%s","email":"%s"}', 'd6b6e6b4-20d0-4cca-9860-25232a5df977', 'darius@blacklovelink.test')::jsonb, 'email', now(), now(), now())
ON CONFLICT (provider_id, provider) DO NOTHING;
