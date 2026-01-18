-- Initialize CompTIA Tech+ (FC0-U71) Exam and Objectives

DO $$
DECLARE
    cert_id UUID;
BEGIN
    -- 1. Create Certification
    INSERT INTO certifications (title, provider)
    VALUES ('CompTIA Tech+ (FC0-U71)', 'CompTIA')
    RETURNING id INTO cert_id;

    -- 2. Create Objectives (Domains)
    INSERT INTO objectives (title, certification_id) VALUES ('1.0 IT Concepts and Terminology', cert_id);
    INSERT INTO objectives (title, certification_id) VALUES ('2.0 Infrastructure', cert_id);
    INSERT INTO objectives (title, certification_id) VALUES ('3.0 Applications and Software', cert_id);
    INSERT INTO objectives (title, certification_id) VALUES ('4.0 Software Development Concepts', cert_id);
    INSERT INTO objectives (title, certification_id) VALUES ('5.0 Database Fundamentals', cert_id);
    INSERT INTO objectives (title, certification_id) VALUES ('6.0 Security', cert_id);

END $$;
