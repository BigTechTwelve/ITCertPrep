-- Add New Badges and Triggers for Gamification

-- 1. Insert New Badges (Safe Insert without ON CONFLICT)
INSERT INTO badges (name, description, icon, category, criteria)
SELECT 'Quiz Master', 'Achieve a 100% score on a quiz with at least 5 questions.', 'Target', 'mastery', '{"type": "quiz_score", "threshold": 100, "min_questions": 5}'
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE name = 'Quiz Master');

INSERT INTO badges (name, description, icon, category, criteria)
SELECT 'Flashcard Fanatic', 'Review 50 flashcards.', 'Zap', 'dedication', '{"type": "flashcard_count", "threshold": 50}'
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE name = 'Flashcard Fanatic');

INSERT INTO badges (name, description, icon, category, criteria)
SELECT 'Scholar', 'Accumulate 1 hour of total study time.', 'BookOpen', 'dedication', '{"type": "study_time", "threshold": 3600}'
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE name = 'Scholar');


-- 2. Trigger for Quiz Mastery
CREATE OR REPLACE FUNCTION check_quiz_mastery()
RETURNS TRIGGER AS $$
DECLARE
    v_percent numeric;
BEGIN
    -- Avoid division by zero
    IF NEW.total_questions > 0 THEN
        v_percent := (NEW.score::numeric / NEW.total_questions::numeric) * 100;

        -- Check for Quiz Master: 100% and at least 5 questions
        IF v_percent = 100 AND NEW.total_questions >= 5 THEN
            PERFORM public.award_badge_if_not_exists(NEW.user_id, 'Quiz Master');
        END IF;

        -- Check for "Big Brain" (example existing badge) or others here if needed
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_quiz_submission_check_mastery ON quiz_submissions;
CREATE TRIGGER on_quiz_submission_check_mastery
    AFTER INSERT ON quiz_submissions
    FOR EACH ROW
    EXECUTE PROCEDURE check_quiz_mastery();

-- 3. Trigger for Flashcard Milestones
CREATE OR REPLACE FUNCTION check_flashcard_milestones()
RETURNS TRIGGER AS $$
DECLARE
    v_count integer;
BEGIN
    -- Count total reviews for this user
    SELECT count(*) INTO v_count
    FROM flashcard_reviews
    WHERE user_id = NEW.user_id;

    -- Award 'Flashcard Fanatic' at 50 reviews
    IF v_count >= 50 THEN
        PERFORM public.award_badge_if_not_exists(NEW.user_id, 'Flashcard Fanatic');
    END IF;
    
    -- Could add levels here: 100, 500, etc.
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_flashcard_review_check_milestones ON flashcard_reviews;
CREATE TRIGGER on_flashcard_review_check_milestones
    AFTER INSERT ON flashcard_reviews
    FOR EACH ROW
    EXECUTE PROCEDURE check_flashcard_milestones();
