-- Track AI Generation sessions
CREATE TABLE IF NOT EXISTS ai_generation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    objective_id UUID REFERENCES objectives(id),
    prompt_used TEXT,
    response_tokens INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track study duration for analytics
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    total_seconds INTEGER
);

-- RLS Policies
ALTER TABLE ai_generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Admins and Teachers can see logs
CREATE POLICY "Admins/Teachers can view logs" ON ai_generation_logs
FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

CREATE POLICY "Users can insert logs" ON ai_generation_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Session policies
CREATE POLICY "Users can manage own sessions" ON user_sessions
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view student sessions" ON user_sessions
FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
