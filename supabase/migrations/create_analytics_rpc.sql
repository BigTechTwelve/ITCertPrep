-- Analytics System for Teacher Dashboard
-- Analyzes student performance by objective

-- 1. Ensure user_progress indexes exist (since table definition is missing from local migrations)
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_question_id ON user_progress(question_id);

-- 2. RPC: Get Class Weaknesses
-- Returns aggregation of correct/incorrect answers per objective for all students in a class.
CREATE OR REPLACE FUNCTION get_class_weaknesses(p_class_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(stats)
    INTO result
    FROM (
        SELECT 
            o.id as objective_id,
            o.title as objective_title,
            COUNT(up.id) as total_attempts,
            SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END) as correct_count,
            ROUND((SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END)::numeric / COUNT(up.id)::numeric) * 100, 1) as accuracy
        FROM class_enrollments ce
        JOIN user_progress up ON up.user_id = ce.student_id
        JOIN questions q ON up.question_id = q.id
        JOIN objectives o ON q.objective_id = o.id
        WHERE ce.class_id = p_class_id
        GROUP BY o.id, o.title
        ORDER BY accuracy ASC
    ) stats;

    RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RPC: Get Student Weaknesses (Individual)
CREATE OR REPLACE FUNCTION get_student_weaknesses(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(stats)
    INTO result
    FROM (
        SELECT 
            o.id as objective_id,
            o.title as objective_title,
            COUNT(up.id) as total_attempts,
            SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END) as correct_count,
            ROUND((SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END)::numeric / COUNT(up.id)::numeric) * 100, 1) as accuracy
        FROM user_progress up
        JOIN questions q ON up.question_id = q.id
        JOIN objectives o ON q.objective_id = o.id
        WHERE up.user_id = p_student_id
        GROUP BY o.id, o.title
        ORDER BY accuracy ASC
    ) stats;

    RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
