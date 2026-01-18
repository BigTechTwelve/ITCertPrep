-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    type TEXT NOT NULL CHECK (type IN ('quiz', 'certification')),
    target_id UUID NOT NULL, -- The ID of the quiz (certification_id) or specific resource
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for Assignments

-- Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- 1. Teachers can do EVERYTHING with assignments for their own classes
CREATE POLICY "Teachers can manage assignments for their classes"
ON assignments
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM classes
        WHERE classes.id = assignments.class_id
        AND classes.teacher_id = auth.uid()
    )
);

-- 2. Students can VIEW assignments for classes they are enrolled in
CREATE POLICY "Students can view assignments for their enrolled classes"
ON assignments
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM class_enrollments
        WHERE class_enrollments.class_id = assignments.class_id
        AND class_enrollments.student_id = auth.uid()
    )
);
