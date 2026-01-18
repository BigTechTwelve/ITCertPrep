-- Seed Data

-- 1. Create Pathways
INSERT INTO pathways (id, title, description) VALUES
('b34df678-1234-5678-90ab-cdef12345678', 'Information Technology', 'Prepare for careers in IT support, networking, and cybersecurity.');

-- 2. Create Classes
INSERT INTO classes (id, title, pathway_id) VALUES
('c56ef789-2345-6789-01cd-ef0123456789', 'Computer Maintenance', 'b34df678-1234-5678-90ab-cdef12345678'),
('d67ff890-3456-7890-12de-f01234567890', 'Networking Fundamentals', 'b34df678-1234-5678-90ab-cdef12345678');

-- 3. Create Certifications
INSERT INTO certifications (id, title, provider, class_id) VALUES
('e78aa901-4567-8901-23ef-012345678901', 'CompTIA A+ Core 1 (220-1101)', 'CompTIA', 'c56ef789-2345-6789-01cd-ef0123456789'),
('f89bb012-5678-9012-34ff-123456789012', 'CompTIA Network+', 'CompTIA', 'd67ff890-3456-7890-12de-f01234567890');

-- 4. Create Objectives for A+ Core 1
INSERT INTO objectives (id, title, certification_id) VALUES
('a12bc345-6789-0123-45cc-234567890123', '1.0 Mobile Devices', 'e78aa901-4567-8901-23ef-012345678901'),
('b23cd456-7890-1234-56dd-345678901234', '2.0 Networking', 'e78aa901-4567-8901-23ef-012345678901'),
('c34de567-8901-2345-67ee-456789012345', '3.0 Hardware', 'e78aa901-4567-8901-23ef-012345678901');

-- 5. Create Questions (Sample)
INSERT INTO questions (id, objective_id, text, type, points) VALUES
-- Mobile Devices Question
('d45ef678-9012-3456-78ff-567890123456', 'a12bc345-6789-0123-45cc-234567890123', 'Which of the following is the most common connection type for synchronizing a modern Android smartphone to a PC?', 'multiple_choice', 10),
-- Hardware Question
('e56ff789-0123-4567-89aa-678901234567', 'c34de567-8901-2345-67ee-456789012345', 'Which of the following connector types is typically used for a high-end graphics card power connection?', 'multiple_choice', 10);

-- 6. Create Answers
INSERT INTO answers (question_id, text, is_correct) VALUES
-- Answers for Mobile Devices Question
('d45ef678-9012-3456-78ff-567890123456', 'USB-C', true),
('d45ef678-9012-3456-78ff-567890123456', 'Lightning', false),
('d45ef678-9012-3456-78ff-567890123456', 'Micro-USB', false),
('d45ef678-9012-3456-78ff-567890123456', 'Mini-USB', false),

-- Answers for Hardware Question
('e56ff789-0123-4567-89aa-678901234567', 'PCIe 6-pin', true),
('e56ff789-0123-4567-89aa-678901234567', 'SATA', false),
('e56ff789-0123-4567-89aa-678901234567', 'Molex', false),
('e56ff789-0123-4567-89aa-678901234567', 'USB 3.0', false);
