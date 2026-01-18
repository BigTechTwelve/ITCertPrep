-- Gamification System: Badges & Triggers

-- 1. Create Badges Table
DROP TABLE IF EXISTS user_badges;
DROP TABLE IF EXISTS badges;

CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon_key TEXT NOT NULL, -- e.g., 'trophy', 'flame', 'target' (Lucide icon names)
    criteria_type TEXT NOT NULL CHECK (criteria_type IN ('study_time', 'quiz_count', 'perfect_score_count', 'srs_streak')),
    criteria_value INTEGER NOT NULL, -- The threshold to meet
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create User Badges Table (Tracking earned badges)
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, badge_id) -- Prevent duplicate awards
);

-- Enable RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Everyone can view badges" ON badges FOR SELECT USING (true);

CREATE POLICY "Users can view own earned badges" ON user_badges 
    FOR SELECT USING (auth.uid() = user_id);

-- 3. Trigger Function: Check Badge Criteria
-- This generic function checks if a user meets criteria for any unearned badges
CREATE OR REPLACE FUNCTION check_badge_criteria()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_total_study_time INTEGER;
    v_quiz_count INTEGER;
    v_perfect_count INTEGER;
    v_new_badge RECORD;
BEGIN
    -- Determine User ID based on table
    IF TG_TABLE_NAME = 'profiles' THEN
        v_user_id := NEW.id;
        v_total_study_time := NEW.study_time_seconds;
        -- For other metrics, we'd need to query other tables if not in profile
    ELSIF TG_TABLE_NAME = 'quiz_submissions' THEN
        v_user_id := NEW.user_id;
        -- Fetch aggregates
        SELECT COUNT(*) INTO v_quiz_count FROM quiz_submissions WHERE user_id = v_user_id;
        SELECT COUNT(*) INTO v_perfect_count FROM quiz_submissions WHERE user_id = v_user_id AND score = 100;
    END IF;

    -- Loop through potential badges not yet earned
    FOR v_new_badge IN 
        SELECT * FROM badges b
        WHERE NOT EXISTS (
            SELECT 1 FROM user_badges ub 
            WHERE ub.badge_id = b.id AND ub.user_id = v_user_id
        )
    LOOP
        -- Check Study Time Badges
        IF v_new_badge.criteria_type = 'study_time' AND v_total_study_time IS NOT NULL THEN
            IF v_total_study_time >= v_new_badge.criteria_value THEN
                INSERT INTO user_badges (user_id, badge_id) VALUES (v_user_id, v_new_badge.id);
                
                -- Optional: Insert Notification
                INSERT INTO notifications (user_id, title, message, type)
                VALUES (v_user_id, 'Badge Unlocked!', 'You earned the ' || v_new_badge.name || ' badge.', 'success');
            END IF;
        END IF;

        -- Check Quiz Count Badges
        IF v_new_badge.criteria_type = 'quiz_count' AND v_quiz_count IS NOT NULL THEN
             IF v_quiz_count >= v_new_badge.criteria_value THEN
                INSERT INTO user_badges (user_id, badge_id) VALUES (v_user_id, v_new_badge.id);
                
                INSERT INTO notifications (user_id, title, message, type)
                VALUES (v_user_id, 'Badge Unlocked!', 'You earned the ' || v_new_badge.name || ' badge.', 'success');
            END IF;
        END IF;
        
         -- Check Perfect Score Badges
        IF v_new_badge.criteria_type = 'perfect_score_count' AND v_perfect_count IS NOT NULL THEN
             IF v_perfect_count >= v_new_badge.criteria_value THEN
                INSERT INTO user_badges (user_id, badge_id) VALUES (v_user_id, v_new_badge.id);
                
                INSERT INTO notifications (user_id, title, message, type)
                VALUES (v_user_id, 'Badge Unlocked!', 'You earned the ' || v_new_badge.name || ' badge.', 'success');
            END IF;
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Attach Triggers
-- Run on Profile update (for study time)
DROP TRIGGER IF EXISTS trigger_check_badges_profile ON profiles;
CREATE TRIGGER trigger_check_badges_profile
    AFTER UPDATE OF study_time_seconds
    ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION check_badge_criteria();

-- Run on Quiz Submission (for counts/scores)
DROP TRIGGER IF EXISTS trigger_check_badges_quiz ON quiz_submissions;
CREATE TRIGGER trigger_check_badges_quiz
    AFTER INSERT
    ON quiz_submissions
    FOR EACH ROW
    EXECUTE FUNCTION check_badge_criteria();


-- 5. Seed Initial Badges
INSERT INTO badges (name, description, icon_key, criteria_type, criteria_value) VALUES
    ('Novice Scholar', 'Study for 1 hour total', 'book-open', 'study_time', 3600),
    ('Dedicated Learner', 'Study for 10 hours total', 'library', 'study_time', 36000),
    ('Quiz Taker', 'Complete 5 Quizzes', 'pen-tool', 'quiz_count', 5),
    ('Mastermind', 'Get 3 Perfect Scores', 'brain', 'perfect_score_count', 3)
ON CONFLICT (name) DO NOTHING;
