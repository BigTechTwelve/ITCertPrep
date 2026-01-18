-- Create Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    teacher_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_public BOOLEAN DEFAULT FALSE
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage their own quizzes"
ON quizzes
USING (auth.uid() = teacher_id);

CREATE POLICY "Student can view assigned quizzes"
ON quizzes
FOR SELECT
USING (TRUE); -- Simplified for MVP, ideally connected to assignments

-- Create Quiz Questions (Junction)
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(quiz_id, question_id)
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Viewable by everyone"
ON quiz_questions FOR SELECT USING (TRUE);

CREATE POLICY "Teachers can manage"
ON quiz_questions
USING (
    EXISTS (SELECT 1 FROM quizzes WHERE id = quiz_questions.quiz_id AND teacher_id = auth.uid())
);


-- Create Quiz Submissions (Attempts)
CREATE TABLE IF NOT EXISTS quiz_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own submissions"
ON quiz_submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Teachers view submissions for their quizzes"
ON quiz_submissions
FOR SELECT
USING (
    EXISTS (SELECT 1 FROM quizzes WHERE id = quiz_submissions.quiz_id AND teacher_id = auth.uid())
);

CREATE POLICY "Users can insert own submissions"
ON quiz_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
