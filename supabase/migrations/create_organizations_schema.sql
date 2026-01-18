-- Phase 11: Organization Hierarchy & Advanced Onboarding Schema

-- 1. Create Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    domain TEXT, -- e.g., 'yale.edu' for future auto-verification
    address TEXT,
    contact_email TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Public read access for now (so users can find orgs to join)
DROP POLICY IF EXISTS "Organizations are viewable by everyone" ON organizations;
CREATE POLICY "Organizations are viewable by everyone" 
ON organizations FOR SELECT 
USING (true);

-- Only Admins can insert/update/delete organizations (for now, or Teachers can create pending ones)
-- Let's allow authenticated users (Teachers) to create them, but they default to unverified.
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;
CREATE POLICY "Authenticated users can create organizations" 
ON organizations FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update organizations" ON organizations;
CREATE POLICY "Admins can update organizations" 
ON organizations FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- 2. Update Profiles Table (Link to Organization)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- 3. Update Classes Table
-- Add organization link
ALTER TABLE classes 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Add pathway link (Career Cluster)
ALTER TABLE classes 
ADD COLUMN IF NOT EXISTS pathway_id UUID REFERENCES pathways(id);

-- Add Class Code (6-char alphanumeric, unique)
ALTER TABLE classes 
ADD COLUMN IF NOT EXISTS class_code TEXT UNIQUE;

-- Index for fast lookup by code
CREATE INDEX IF NOT EXISTS idx_classes_class_code ON classes(class_code);


-- 4. Create Class Enrollments Table (Many-to-Many: Students <-> Classes)
CREATE TABLE IF NOT EXISTS class_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- Enable RLS
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;

-- Policies for Class Enrollments

-- View: Students see their own enrollments, Teachers see enrollments for their classes
DROP POLICY IF EXISTS "Users view own enrollments" ON class_enrollments;
CREATE POLICY "Users view own enrollments" 
ON class_enrollments FOR SELECT 
USING (
    student_id = auth.uid() 
    OR 
    EXISTS (
        SELECT 1 FROM classes 
        WHERE classes.id = class_enrollments.class_id 
        AND classes.teacher_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Insert: Students can enroll themselves (via code logic in app/RPC later), Teachers/Admins can enroll students
DROP POLICY IF EXISTS "Students can enroll themselves" ON class_enrollments;
CREATE POLICY "Students can enroll themselves" 
ON class_enrollments FOR INSERT 
WITH CHECK (
    student_id = auth.uid()
    OR
    EXISTS (
        SELECT 1 FROM classes 
        WHERE classes.id = class_enrollments.class_id 
        AND classes.teacher_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Delete: Students can leave, Teachers/Admins can remove
DROP POLICY IF EXISTS "Users can remove enrollments" ON class_enrollments;
CREATE POLICY "Users can remove enrollments" 
ON class_enrollments FOR DELETE 
USING (
    student_id = auth.uid()
    OR
    EXISTS (
        SELECT 1 FROM classes 
        WHERE classes.id = class_enrollments.class_id 
        AND classes.teacher_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- 5. Create Helper Function to Generate Class Code
-- This finds a unique 6-char code. Intended to be called by app or trigger.
CREATE OR REPLACE FUNCTION generate_unique_class_code() 
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Removed I, 1, O, 0 for readability
    result TEXT := '';
    i INTEGER := 0;
    collision BOOLEAN;
BEGIN
    LOOP
        result := '';
        FOR i IN 1..6 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        END LOOP;
        
        -- Check for collision
        SELECT EXISTS(SELECT 1 FROM classes WHERE class_code = result) INTO collision;
        
        EXIT WHEN NOT collision;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-assign class_code on insert if null
CREATE OR REPLACE FUNCTION set_class_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.class_code IS NULL THEN
        NEW.class_code := generate_unique_class_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_class_code ON classes;
CREATE TRIGGER trigger_set_class_code
BEFORE INSERT ON classes
FOR EACH ROW
EXECUTE FUNCTION set_class_code();
