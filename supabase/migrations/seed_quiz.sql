-- Seed a Quiz
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
    -- Get a teacher (Test User or any teacher)
    SELECT id INTO teacher_id FROM profiles WHERE role = 'teacher' LIMIT 1;
    
    -- If no teacher, just pick ANY user and make them teacher for this seed
    IF teacher_id IS NULL THEN
        SELECT id INTO teacher_id FROM profiles LIMIT 1;
        UPDATE profiles SET role = 'teacher' WHERE id = teacher_id;
    END IF;

    -- Create a Dummy Certification and Objective for the questions (FK requirement)
    INSERT INTO certifications (title, provider) VALUES ('General IT Knowledge', 'Internal') RETURNING id INTO cert_id;
    INSERT INTO objectives (title, certification_id) VALUES ('Basics', cert_id) RETURNING id INTO obj_id;

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

    -- Create the Quiz
    INSERT INTO quizzes (title, description, teacher_id, is_public) 
    VALUES ('Chapter 1 Quiz', 'Basic hardware and software check.', teacher_id, true) 
    RETURNING id INTO quiz_id;

    -- Link Questions to Quiz
    INSERT INTO quiz_questions (quiz_id, question_id, "order") VALUES 
    (quiz_id, q1_id, 1),
    (quiz_id, q2_id, 2);

END $$;
