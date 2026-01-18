-- Update game_sessions table to support full PvP gameplay
-- We use DO block or IF NOT EXISTS to be idempotent

DO $$
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'game_sessions' AND column_name = 'questions') THEN
        ALTER TABLE game_sessions ADD COLUMN questions jsonb DEFAULT '[]'::jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'game_sessions' AND column_name = 'player_1_score') THEN
        ALTER TABLE game_sessions ADD COLUMN player_1_score integer DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'game_sessions' AND column_name = 'player_2_score') THEN
        ALTER TABLE game_sessions ADD COLUMN player_2_score integer DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'game_sessions' AND column_name = 'player_1_progress') THEN
        ALTER TABLE game_sessions ADD COLUMN player_1_progress integer DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'game_sessions' AND column_name = 'player_2_progress') THEN
        ALTER TABLE game_sessions ADD COLUMN player_2_progress integer DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'game_sessions' AND column_name = 'winner_id') THEN
        ALTER TABLE game_sessions ADD COLUMN winner_id uuid REFERENCES profiles(id);
    END IF;

    -- Ensure RLS is enabled
    EXECUTE 'ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY';

END $$;

-- Re-apply policies to be safe (drop first to avoid errors)
DROP POLICY IF EXISTS "Anyone can read game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Authenticated users can create sessions" ON game_sessions;
DROP POLICY IF EXISTS "Players can update their sessions" ON game_sessions;

CREATE POLICY "Anyone can read game sessions"
    ON game_sessions FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create sessions"
    ON game_sessions FOR INSERT
    WITH CHECK (auth.uid() = player_1_id);

CREATE POLICY "Players can update their sessions"
    ON game_sessions FOR UPDATE
    USING (auth.uid() = player_1_id OR auth.uid() = player_2_id);
