-- First, ensure the unique constraint exists so ON CONFLICT works
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'pathways_title_key'
    ) THEN
        -- Check if title is already unique and no constraint exists (rare but possible) or just add it
        ALTER TABLE pathways ADD CONSTRAINT pathways_title_key UNIQUE (title);
    END IF;
EXCEPTION
    WHEN duplicate_table THEN 
        RAISE NOTICE 'Constraint already exists';
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not create constraint (stateless check): %', SQLERRM;
END $$;

-- Now seed the data
INSERT INTO pathways (title, description)
VALUES 
    ('Arts and Communications', 'Careers related to the humanities and to the performing, visual, literary, and media arts.'),
    ('Business, Management, Marketing, and Technology', 'Careers related to all aspects of business including accounting, business administration, finance, information processing, and marketing.'),
    ('Engineering/Manufacturing and Industrial Technology', 'Careers related to technologies necessary to design, develop, install, and maintain physical systems.'),
    ('Health Sciences', 'Careers related to the promotion of health as well as the treatment of injuries, conditions, and disease.'),
    ('Human Services', 'Careers related to economic, political, and social systems including education, government, law and law enforcement, leisure and recreation, military, religion, child care, and social services.'),
    ('Natural Resources and Agriscience', 'Careers related to the environment and natural resources and to agriculture, food, and natural resources.')
ON CONFLICT (title) DO NOTHING;
