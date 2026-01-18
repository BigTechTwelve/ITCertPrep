CREATE TABLE game_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    code text NOT NULL UNIQUE,
    certification_id uuid REFERENCES certifications(id) ON DELETE CASCADE,
    host_id uuid REFERENCES profiles(id) NOT NULL,
    guest_id uuid REFERENCES profiles(id),
    status text NOT NULL DEFAULT 'waiting', -- 'waiting', 'playing', 'completed'
    questions jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of question objects
    host_score integer DEFAULT 0,
    guest_score integer DEFAULT 0,
    host_progress integer DEFAULT 0,
    guest_progress integer DEFAULT 0,
    winner_id uuid REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Indexes
CREATE INDEX game_sessions_code_idx ON game_sessions(code);
CREATE INDEX game_sessions_status_idx ON game_sessions(status);

-- RLS
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read game sessions"
    ON game_sessions FOR SELECT
    USING (true); -- Needed for guest to find by code

CREATE POLICY "Authenticated users can create sessions"
    ON game_sessions FOR INSERT
    WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Players can update their sessions"
    ON game_sessions FOR UPDATE
    USING (auth.uid() = host_id OR auth.uid() = guest_id);
