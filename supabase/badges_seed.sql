-- Insert Badges
insert into badges (name, description, icon, category, criteria) values
('First Steps', 'Completed your first quiz', 'Footprints', 'dedication', '{"type": "quiz_count", "threshold": 1}'),
('High Flyer', 'Scored 100% on a quiz', 'Rocket', 'mastery', '{"type": "perfect_score", "threshold": 1}'),
('Dedicated Student', 'Completed 10 quizzes', 'BookOpen', 'dedication', '{"type": "quiz_count", "threshold": 10}'),
('Speed Demon', 'Answered a question in under 2 seconds', 'Zap', 'mastery', '{"type": "speed", "threshold": 2}'),
('Course Completion', 'Completed all questions in a Certification', 'Award', 'achievement', '{"type": "cert_complete", "threshold": 1}'),
('Time Traveler', 'Studied for 1 Hour', 'Clock', 'dedication', '{"type": "time_total", "threshold": 3600}'),
('Dedicated Scholar', 'Studied for 10 Hours', 'Hourglass', 'dedication', '{"type": "time_total", "threshold": 36000}'),
('Master of Time', 'Studied for 24 Hours', 'Calendar', 'dedication', '{"type": "time_total", "threshold": 86400}');
