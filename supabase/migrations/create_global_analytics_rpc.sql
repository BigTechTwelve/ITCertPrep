-- Create RPC for Global Analytics (Admin Dashboard)
-- Returns aggregated user growth and activity for the last 7 days.

CREATE OR REPLACE FUNCTION get_global_analytics()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- We will build a JSON array of objects: { date: 'YYYY-MM-DD', new_users: 12, quizzes_completed: 45 }
    -- for the last 7 days.
    
    WITH dates AS (
        SELECT generate_series(
            CURRENT_DATE - INTERVAL '6 days',
            CURRENT_DATE,
            '1 day'::interval
        )::date AS day
    ),
    user_counts AS (
        SELECT 
            created_at::date AS day,
            COUNT(*) as count
        FROM auth.users
        WHERE created_at >= (CURRENT_DATE - INTERVAL '7 days')
        GROUP BY created_at::date
    ),
    quiz_counts AS (
        SELECT
            created_at::date AS day,
            COUNT(*) as count
        FROM quiz_sessions
        WHERE status = 'completed'
        AND created_at >= (CURRENT_DATE - INTERVAL '7 days')
        GROUP BY created_at::date
    )
    SELECT jsonb_agg(
        jsonb_build_object(
            'date', TO_CHAR(d.day, 'YYYY-MM-DD'),
            'new_users', COALESCE(u.count, 0),
            'quizzes_completed', COALESCE(q.count, 0)
        ) ORDER BY d.day
    ) INTO result
    FROM dates d
    LEFT JOIN user_counts u ON d.day = u.day
    LEFT JOIN quiz_counts q ON d.day = q.day;

    RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant access to authenticated users (or just admins if preferred, but dashboard needs it)
GRANT EXECUTE ON FUNCTION get_global_analytics() TO authenticated;
GRANT EXECUTE ON FUNCTION get_global_analytics() TO service_role;
