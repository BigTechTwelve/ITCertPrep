CREATE OR REPLACE FUNCTION get_pvp_questions(limit_count int)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', q.id,
            'text', q.text,
            'correct_answer', (SELECT text FROM answers WHERE question_id = q.id AND is_correct = true LIMIT 1),
            'answers', (
                SELECT jsonb_agg(
                    jsonb_build_object('id', a.id, 'text', a.text)
                )
                FROM answers a
                WHERE a.question_id = q.id
            )
        )
    )
    INTO result
    FROM (
        SELECT * FROM questions
        ORDER BY random()
        LIMIT limit_count
    ) q;

    RETURN result;
END;
$$;
