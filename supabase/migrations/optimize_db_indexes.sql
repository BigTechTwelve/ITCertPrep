-- Optimizing Database Indexes for Performance
-- Adding indexes to frequently used Foreign Keys and Filter Columns
-- Indexes are IF NOT EXISTS to prevent errors if already manually added.

-- 1. Game Sessions (PvP)
CREATE INDEX IF NOT EXISTS idx_game_sessions_certification_id ON game_sessions(certification_id);
-- Uses player_1_id/player_2_id based on recent schema inspection
CREATE INDEX IF NOT EXISTS idx_game_sessions_player_1_id ON game_sessions(player_1_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_player_2_id ON game_sessions(player_2_id);

-- 2. Quizzes & Questions
CREATE INDEX IF NOT EXISTS idx_quizzes_teacher_id ON quizzes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_question_id ON quiz_questions(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_quiz_id ON quiz_submissions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_user_id ON quiz_submissions(user_id);

-- 3. Classes & Enrollment
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_pathway_id ON classes(pathway_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_class_id ON class_enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_student_id ON class_enrollments(student_id);

-- 4. Guilds
CREATE INDEX IF NOT EXISTS idx_guilds_leader_id ON guilds(leader_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_guild_id ON guild_members(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_user_id ON guild_members(user_id);
CREATE INDEX IF NOT EXISTS idx_guild_messages_guild_id ON guild_messages(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_messages_user_id ON guild_messages(user_id);

-- 5. Content Hierarchy
CREATE INDEX IF NOT EXISTS idx_objectives_certification_id ON objectives(certification_id);

-- NOTE: 'questions' table creates indexes automatically on primary key, but foreign key index is good.
-- Verifying 'questions' table has 'objective_id' from usage in seeds. 
-- However, if 'questions' table creation is not visible, we can try to add it.
CREATE INDEX IF NOT EXISTS idx_questions_objective_id ON questions(objective_id);
-- Answers likely link to question_id
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);

-- 6. Flashcards
-- Flashcards do NOT have objective_id directly (they may link to questions or just have front/back).
-- TABLE NAME IS 'flashcard_reviews' NOT 'user_flashcards'
CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_user_id ON flashcard_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_flashcard_id ON flashcard_reviews(flashcard_id);
