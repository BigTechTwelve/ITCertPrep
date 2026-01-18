-- Secure Quiz Data Tables
-- Enforces RLS on core content tables to prevent unauthorized modification.

DO $$
BEGIN
    -- 1. Certifications
    EXECUTE 'ALTER TABLE certifications ENABLE ROW LEVEL SECURITY';
    
    DROP POLICY IF EXISTS "Anyone can read certifications" ON certifications;
    CREATE POLICY "Anyone can read certifications" ON certifications FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Admins can manage certifications" ON certifications;
    CREATE POLICY "Admins can manage certifications" ON certifications FOR ALL 
    USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


    -- 2. Objectives
    EXECUTE 'ALTER TABLE objectives ENABLE ROW LEVEL SECURITY';

    DROP POLICY IF EXISTS "Anyone can read objectives" ON objectives;
    CREATE POLICY "Anyone can read objectives" ON objectives FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Admins can manage objectives" ON objectives;
    CREATE POLICY "Admins can manage objectives" ON objectives FOR ALL 
    USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


    -- 3. Questions (If exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'questions') THEN
        EXECUTE 'ALTER TABLE questions ENABLE ROW LEVEL SECURITY';
        
        DROP POLICY IF EXISTS "Anyone can read questions" ON questions;
        EXECUTE 'CREATE POLICY "Anyone can read questions" ON questions FOR SELECT USING (true)';
        
        DROP POLICY IF EXISTS "Admins can manage questions" ON questions;
        EXECUTE 'CREATE POLICY "Admins can manage questions" ON questions FOR ALL USING (exists (select 1 from profiles where id = auth.uid() and role = ''admin''))';
    END IF;


    -- 4. Answers (If exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'answers') THEN
        EXECUTE 'ALTER TABLE answers ENABLE ROW LEVEL SECURITY';
        
        DROP POLICY IF EXISTS "Anyone can read answers" ON answers;
        EXECUTE 'CREATE POLICY "Anyone can read answers" ON answers FOR SELECT USING (true)';
        
        DROP POLICY IF EXISTS "Admins can manage answers" ON answers;
        EXECUTE 'CREATE POLICY "Admins can manage answers" ON answers FOR ALL USING (exists (select 1 from profiles where id = auth.uid() and role = ''admin''))';
    END IF;

END $$;
