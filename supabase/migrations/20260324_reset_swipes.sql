-- 20260324_reset_swipes.sql

-- Create a secure RPC function to allow users to reset their swipe history
CREATE OR REPLACE FUNCTION public.reset_user_swipes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges to bypass RLS if necessary
AS $$
BEGIN
    -- Ensure the user is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Delete all matches involving this user
    DELETE FROM public.matches 
    WHERE user_a = auth.uid() OR user_b = auth.uid();

    -- Delete all outgoing swipes from this user
    DELETE FROM public.swipes 
    WHERE swiper_id = auth.uid();
    
    -- We deliberately do NOT delete incoming swipes (swiped_id = auth.uid()) 
    -- because other people's actions should remain intact.
END;
$$;
