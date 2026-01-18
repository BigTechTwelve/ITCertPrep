-- Create a function to get random questions for specific objectives
CREATE OR REPLACE FUNCTION get_random_questions(
    p_objective_ids UUID[],
    p_limit INT
)
RETURNS TABLE (
    id UUID,
    objective_id UUID,
    text TEXT,
    type TEXT,
    points INT,
    explanation TEXT,
    created_at TIMESTAMPTZ,
    answer_id UUID,
    answer_text TEXT,
    answer_is_correct BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH random_questions AS (
        SELECT q.id, q.objective_id, q.text, q.type::text, q.points, q.explanation, q.created_at
        FROM questions q
        WHERE q.objective_id = ANY(p_objective_ids)
        ORDER BY random()
        LIMIT p_limit
    )
    SELECT 
        rq.id, 
        rq.objective_id, 
        rq.text, 
        rq.type, 
        rq.points, 
        rq.explanation, 
        rq.created_at,
        a.id AS answer_id,
        a.text AS answer_text,
        a.is_correct AS answer_is_correct
    FROM random_questions rq
    JOIN answers a ON rq.id = a.question_id;
END;
$$;
