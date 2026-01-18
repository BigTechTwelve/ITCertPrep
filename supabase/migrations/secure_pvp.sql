-- Secure PvP: Prevent Score Tampering (Trigger Implementation)
-- RLS policies cannot easily compare OLD vs NEW values to prevent specific column updates.
-- We use a Trigger for this fine-grained control.

-- 1. Create the validation function
CREATE OR REPLACE FUNCTION validate_pvp_update()
RETURNS TRIGGER AS $$
BEGIN
    -- If the user is Player 1
    IF auth.uid() = OLD.player_1_id THEN
        -- They cannot change Player 2's data
        IF NEW.player_2_score IS DISTINCT FROM OLD.player_2_score OR
           NEW.player_2_progress IS DISTINCT FROM OLD.player_2_progress THEN
            RAISE EXCEPTION 'Player 1 cannot update Player 2 statistics.';
        END IF;
    
    -- If the user is Player 2
    ELSIF auth.uid() = OLD.player_2_id THEN
        -- They cannot change Player 1's data
        IF NEW.player_1_score IS DISTINCT FROM OLD.player_1_score OR
           NEW.player_1_progress IS DISTINCT FROM OLD.player_1_progress THEN
             RAISE EXCEPTION 'Player 2 cannot update Player 1 statistics.';
        END IF;
    
    -- If user is neither (but RLS allowed them? e.g. Admin or glitch)
    -- We can strictly enforce "Must be a player" here or rely on RLS.
    -- relying on RLS is fine, but checking won't hurt.
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the Trigger
DROP TRIGGER IF EXISTS trg_validate_pvp_update ON game_sessions;
CREATE TRIGGER trg_validate_pvp_update
    BEFORE UPDATE ON game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION validate_pvp_update();

-- 3. Simplified RLS Policy (Access Control)
-- Controls "WHO" can update (Players)
DROP POLICY IF EXISTS "Players can update their sessions" ON game_sessions;

CREATE POLICY "Players can update their sessions"
ON game_sessions
FOR UPDATE
USING (auth.uid() = player_1_id OR auth.uid() = player_2_id);
