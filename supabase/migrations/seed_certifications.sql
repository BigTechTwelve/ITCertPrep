
-- Clean up existing data to avoid duplicates (Development only)
DELETE FROM certifications WHERE title = 'CompTIA A+ Core 1 (220-1101)';

DO $$
DECLARE
    cert_id UUID;
    obj_mobile UUID;
    obj_network UUID;
    obj_hardware UUID;
    obj_cloud UUID;
    obj_troubleshoot UUID;
    q_id UUID;
BEGIN
    -- 1. Create Certification
    INSERT INTO certifications (title, provider)
    VALUES ('CompTIA A+ Core 1 (220-1101)', 'CompTIA')
    RETURNING id INTO cert_id;

    -- 2. Create Objectives (Domains)
    INSERT INTO objectives (title, certification_id) VALUES ('Mobile Devices', cert_id) RETURNING id INTO obj_mobile;
    INSERT INTO objectives (title, certification_id) VALUES ('Networking', cert_id) RETURNING id INTO obj_network;
    INSERT INTO objectives (title, certification_id) VALUES ('Hardware', cert_id) RETURNING id INTO obj_hardware;
    INSERT INTO objectives (title, certification_id) VALUES ('Virtualization and Cloud Computing', cert_id) RETURNING id INTO obj_cloud;
    INSERT INTO objectives (title, certification_id) VALUES ('Hardware and Network Troubleshooting', cert_id) RETURNING id INTO obj_troubleshoot;

    -- 3. Create Questions for Mobile Devices
    INSERT INTO questions (text, objective_id, type, points) 
    VALUES ('Which type of display technology is most commonly used in modern smartphones?', obj_mobile, 'multiple_choice', 10) 
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES 
    (q_id, 'OLED', true), (q_id, 'CRT', false), (q_id, 'Plasma', false), (q_id, 'E-Ink', false);

    INSERT INTO questions (text, objective_id, type, points) 
    VALUES ('Which connector would you use to charge an iPhone 15?', obj_mobile, 'multiple_choice', 10) 
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES 
    (q_id, 'USB-C', true), (q_id, 'Lightning', false), (q_id, 'Micro-USB', false), (q_id, 'Mini-USB', false);

    -- 4. Create Questions for Networking
    INSERT INTO questions (text, objective_id, type, points) 
    VALUES ('Which port is used by HTTP?', obj_network, 'multiple_choice', 10) 
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES 
    (q_id, '80', true), (q_id, '443', false), (q_id, '21', false), (q_id, '22', false);

    INSERT INTO questions (text, objective_id, type, points) 
    VALUES ('Which protocol is connectionless and does not guarantee delivery?', obj_network, 'multiple_choice', 10) 
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES 
    (q_id, 'UDP', true), (q_id, 'TCP', false), (q_id, 'FTP', false), (q_id, 'SSH', false);

    -- 5. Create Questions for Hardware
    INSERT INTO questions (text, objective_id, type, points) 
    VALUES ('Which component is responsible for persistent data storage?', obj_hardware, 'multiple_choice', 10) 
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES 
    (q_id, 'SSD', true), (q_id, 'RAM', false), (q_id, 'CPU', false), (q_id, 'GPU', false);

END $$;
