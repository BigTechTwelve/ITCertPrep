-- Drop existing tables to ensure clean slate (Development only!)
DROP TABLE IF EXISTS quiz_submissions CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;

-- Create Quizzes Table
CREATE TABLE quizzes (
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
USING (TRUE); 

-- Create Quiz Questions (Junction)
CREATE TABLE quiz_questions (
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
CREATE TABLE quiz_submissions (
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

-- SEED DATA 
DO $$
DECLARE
    teacher_id UUID;
    quiz_id UUID;
    q1_id UUID;
    q2_id UUID;
    q3_id UUID;
    cert_id UUID;
    obj_id UUID;
BEGIN
    SELECT id INTO teacher_id FROM profiles WHERE role = 'teacher' LIMIT 1;
    IF teacher_id IS NULL THEN
        SELECT id INTO teacher_id FROM profiles LIMIT 1;
        UPDATE profiles SET role = 'teacher' WHERE id = teacher_id;
    END IF;

    -- Upsert Seed Cert/Objective to avoid duplicates if re-run
    -- We'll just create new ones or find existing.
    SELECT id INTO cert_id FROM certifications WHERE title = 'General IT Knowledge' LIMIT 1;
    IF cert_id IS NULL THEN
        INSERT INTO certifications (title, provider) VALUES ('General IT Knowledge', 'Internal') RETURNING id INTO cert_id;
    END IF;

    SELECT id INTO obj_id FROM objectives WHERE title = 'Basics' AND certification_id = cert_id LIMIT 1;
    IF obj_id IS NULL THEN
        INSERT INTO objectives (title, certification_id) VALUES ('Basics', cert_id) RETURNING id INTO obj_id;
    END IF;

    -- Create Questions
    INSERT INTO questions (text, objective_id, type, points) VALUES 
    ('What does CPU stand for?', obj_id, 'multiple_choice', 10) RETURNING id INTO q1_id;
    
    INSERT INTO answers (question_id, text, is_correct) VALUES 
    (q1_id, 'Central Processing Unit', true),
    (q1_id, 'Central Power Unit', false),
    (q1_id, 'Computer Personal Unit', false);

    INSERT INTO questions (text, objective_id, type, points) VALUES 
    ('Which of these is an operating system?', obj_id, 'multiple_choice', 10) RETURNING id INTO q2_id;

    INSERT INTO answers (question_id, text, is_correct) VALUES 
    (q2_id, 'Linux', true),
    (q2_id, 'HTML', false),
    (q2_id, 'Python', false);

    -- Create/Recreate the Quiz
    INSERT INTO quizzes (title, description, teacher_id, is_public) 
    VALUES ('Chapter 1 Quiz', 'Basic hardware and software check.', teacher_id, true) 
    RETURNING id INTO quiz_id;

    -- Link Questions
    INSERT INTO quiz_questions (quiz_id, question_id, "order") VALUES 
    (quiz_id, q1_id, 1),
    (quiz_id, q2_id, 2);

END $$;
