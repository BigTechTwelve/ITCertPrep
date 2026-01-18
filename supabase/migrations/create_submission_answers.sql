-- Create submission_answers table for granular quiz tracking
CREATE TABLE IF NOT EXISTS submission_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES quiz_submissions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer_id UUID NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE submission_answers ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Users can view their own answers
CREATE POLICY "Users can view own submission answers"
    ON submission_answers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM quiz_submissions qs
            WHERE qs.id = submission_answers.submission_id
            AND qs.user_id = auth.uid()
        )
    );

-- 2. Users can insert their own answers (via the quiz submission flow)
-- Note: Ideally this should be handled by a secure RPC to prevent tampering, 
-- but for MVP we allow insert if the linked submission belongs to the user.
CREATE POLICY "Users can insert own submission answers"
    ON submission_answers
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM quiz_submissions qs
            WHERE qs.id = submission_answers.submission_id
            AND qs.user_id = auth.uid()
        )
    );

-- 3. Teachers can view answers for students in their classes
CREATE POLICY "Teachers can view student answers"
    ON submission_answers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM quiz_submissions qs
            JOIN class_enrollments ce ON qs.user_id = ce.student_id
            JOIN classes c ON ce.class_id = c.id
            WHERE qs.id = submission_answers.submission_id
            AND c.teacher_id = auth.uid()
        )
    );

-- Indexes for performance
CREATE INDEX idx_submission_answers_submission_id ON submission_answers(submission_id);
CREATE INDEX idx_submission_answers_question_id ON submission_answers(question_id);
