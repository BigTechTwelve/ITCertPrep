-- Content: Questions 1-30 for Domain 4.0 Software Development Concepts
DO $$
DECLARE
    cert_id UUID;
    obj_id UUID;
    q_id UUID;
BEGIN
    -- Look up the certification ID
    SELECT id INTO cert_id FROM certifications WHERE title = 'CompTIA Tech+ (FC0-U71)' LIMIT 1;
    
    -- Look up the objective ID for Domain 4.0
    SELECT id INTO obj_id FROM objectives WHERE certification_id = cert_id AND title = '4.0 Software Development Concepts' LIMIT 1;

    -- If identifiers are not found, raise an exception
    IF cert_id IS NULL OR obj_id IS NULL THEN
        RAISE EXCEPTION 'Certification or Objective not found. Ensure 4.0 Software Development Concepts exists.';
    END IF;

    -- Question 1: Programming Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which language is primarily used for styling web pages?', 'CSS (Cascading Style Sheets) is used for styling and layout.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HTML', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'XML', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CSS', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SQL', false);

    -- Question 2: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type is best suited for storing a simple True or False value?', 'Boolean is a binary data type (True/False).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'String', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Float', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', true);

    -- Question 3: Programming Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In programming, what is a "Loop"?', 'A structure that repeats a block of code until a specific condition is met.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A variable that cannot change', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A connection to the internet', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A sequence of instructions that repeats', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'An error in the code', false);

    -- Question 4: Programming Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the primary function of a "Variable" in programming?', 'To store a value that can be referenced and manipulated.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To compile the code', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To store data', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To display graphics', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To connect to a database', false);

    -- Question 5: Interpreted vs Compiled
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of language is Python generally considered?', 'Python is primarily an Interpreted language.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compiled', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Interpreted', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Assembly', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Machine Code', false);

    -- Question 6: Web Development
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which language provides the structure and content of a web page?', 'HTML (HyperText Markup Language) defines structure.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'JavaScript', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CSS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HTML', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Python', false);

    -- Question 7: Programming Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which structure is used to make decisions in code (e.g., "If this, then that")?', 'Conditionals / Branching logic handles decisions.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Loop', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Array', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Branching / Conditionals', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Constant', false);

    -- Question 8: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "String" data type is used to store:', 'Text or a sequence of characters.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Whole numbers', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Decimal numbers', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Text / Characters', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'True/False values', false);

    -- Question 9: Data Structures
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data structure is an ordered list of elements that can be accessed by an index?', 'An Array (or List) stores ordered elements accessible via index.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Variable', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Array / Vector', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Function', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Loop', false);

    -- Question 10: Programming Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A set of reusable code instructions that performs a specific task is called a:', 'A Function (or Method/Subroutine).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Variable', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Function', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Comment', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Constant', false);

    -- Question 11: Application Architecture
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Code that runs on the server side is generally referred to as:', 'Backend code runs on the server.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Frontend', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Backend', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'UI', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Client-side', false);

    -- Question 12: Programming Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which language adds interactivity and logic to web pages?', 'JavaScript makes web pages interactive.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HTML', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CSS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'JavaScript', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SQL', false);

    -- Question 13: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type represents a number with a decimal point (e.g., 3.14)?', 'Float (Floating point) or Double represents decimal numbers.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Float', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Char', false);

    -- Question 14: Programming Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a "Constant"?', 'A value that cannot be changed once it is assigned.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A variable that change frequently', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A value that remains fixed/unchanged', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A type of loop', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A function name', false);

    -- Question 15: Pseudocode
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Pseudocode"?', 'A plain language description of the steps in an algorithm, not actual code.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Machine code', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compilable code', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Informal high-level description of an algorithm', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A programming language', false);

    -- Question 16: Compiling
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does an "Interpreter" do?', 'Translates and executes code line-by-line at runtime.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Converts entire code to binary before running', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Executes code line-by-line', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Stores data in a database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Deletes old code', false);

    -- Question 17: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which boolean operator returns TRUE only if BOTH conditions are true?', 'AND operator.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'OR', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'NOT', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'AND', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'XOR', false);

    -- Question 18: Programming Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Object-Oriented Programming (OOP) is based on the concept of:', 'Objects, which contain data (attributes) and code (methods).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Functions only', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Objects', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Linear execution', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Database tables', false);

    -- Question 19: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of these is a low-level programming language?', 'Assembly is a low-level language close to machine code.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Python', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Java', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Assembly', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'C#', false);

    -- Question 20: Web Development
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the "DOM" in web development?', 'Document Object Model, representing the page structure.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data Object Module', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Document Object Model', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Disk Operating Mode', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Digital Output Method', false);

    -- Question 21: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'An "Integer" is:', 'A whole number without a fractional part.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A number with decimals', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A whole number', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A text string', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A true/false value', false);

    -- Question 22: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is an "Infinite Loop"?', 'A loop that never terminates because its condition always evaluates to true.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A loop that runs once', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A loop that never ends', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A very fast loop', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A broken variable', false);

    -- Question 23: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the purpose of comments in code?', 'To prevent execution of specific lines and explain the code to humans.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To make the code faster', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To explain code to humans (ignored by compiler)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To store user data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To debug the OS', false);

    -- Question 24: Architecture
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Frontend development primarily involves:', 'Building the user interface and experience (HTML, CSS, JS).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Server configuration', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Database design', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'User Interface (UI) and UX', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Operating System kernels', false);

    -- Question 25: Markup
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'XML stands for:', 'Extensible Markup Language.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Extensible Markup Language', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Extra Machine Logic', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Example Markup List', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Executable Main Loop', false);

    -- Question 26: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'SQL is a language used specifically for:', 'Communicating with and managing databases.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Creating games', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Managing Databases', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Editing images', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Operating Systems', false);

    -- Question 27: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which flowchart symbol typically represents a decision (Yes/No)?', 'A Diamond shape represents a decision point.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Rectangle', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Oval', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Diamond', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Parallelogram', false);

    -- Question 28: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is an "Algorithm"?', 'A step-by-step set of instructions to solve a problem.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A random number', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A step-by-step procedure to solve a problem', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A type of hardware', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A programming language', false);

    -- Question 29: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which language is most associated with iOS app development?', 'Swift (or Objective-C) is used for iOS.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'C#', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Swift', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PHP', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ruby', false);

    -- Question 30: Data
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a "Char" data type?', 'A single character.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A long text', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Single Character', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A chart', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A number', false);

    -- Question 31: Programming
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the role of a "Compiler"?', 'Translates high-level source code into machine code (executable) all at once.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Runs code line-by-line', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Stores data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Translates entire code to machine code', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Designs the UI', false);

    -- Question 32: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which programming paradigm uses "Classes" and "Objects"?', 'Object-Oriented Programming (OOP).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Procedural', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Functional', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Object-Oriented (OOP)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Assembly', false);

    -- Question 33: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which language is considered a Client-Side scripting language for web browsers?', 'JavaScript runs in the browser (client-side).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PHP', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'JavaScript', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Python', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SQL', false);

    -- Question 34: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which would be the correct data type to store a phone number that might include hyphens (e.g., "555-1234")?', 'A String, because it contains non-numeric characters (hyphens).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'String', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Float', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', false);

    -- Question 35: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'The boolean operator "OR" returns TRUE if:', 'At least one of the conditions is true.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Both are false', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Both are true', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'At least one is true', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'None are true', false);

    -- Question 36: Development
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In software versions (e.g., 2.1.0), what does the first number "2" typically represent?', 'The Major version, indicating significant changes.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Minor update', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Patch / Fix', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Major version', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Build number', false);

    -- Question 37: Markup
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which markup language is used to structure data for easy processing (e.g., configuration files)?', 'XML (or JSON) is data-focused.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HTML', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'XML', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CSS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SQL', false);

    -- Question 38: Interpreted
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Scripting languages (like Perl, Ruby) are typically:', 'Interpreted rather than compiled.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compiled', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Interpreted', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Low-level', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Assembly', false);

    -- Question 39: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which programming construct repeats code a specific number of times (e.g., "for i = 1 to 10")?', 'A For Loop.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'While Loop', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'For Loop', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'If Statement', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Function', false);

    -- Question 40: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a "Bug" in software?', 'An error or flaw in the code causing incorrect behavior.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A feature', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A virus', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'An error or defect', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A user', false);

    -- Question 41: Data Structures
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data structure follows "First In, First Out" (FIFO)?', 'A Queue is FIFO.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Stack', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Queue', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Tree', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Graph', false);

    -- Question 42: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does the acronym SDK stand for?', 'Software Development Kit.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'System Data Kernel', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Software Development Kit', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Source Design Key', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Security Domain Key', false);

    -- Question 43: Web
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'CSS is used to define:', 'The presentation, style, and layout of a web page.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Server logic', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Database queries', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Presentation / Style', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Content structure', false);

    -- Question 44: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'C++ is an example of which type of language?', 'Compiled (and also Object-Oriented).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Interpreted', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Scripting', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compiled', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Markup', false);

    -- Question 45: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the "NOT" operator used for?', 'It inverts the boolean value (True becomes False, and vice versa).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Adding numbers', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Inverting a boolean value', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Comparing strings', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Stopping a loop', false);

    -- Question 46: Data structures
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data structure follows "Last In, First Out" (LIFO)?', 'A Stack is LIFO.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Queue', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Stack', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Array', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'List', false);

    -- Question 47: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Source Code"?', 'The human-readable code written by a programmer.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The binary executable', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The human-readable code', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The database file', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The output of the program', false);

    -- Question 48: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Java applications run on the JVM, which stands for:', 'Java Virtual Machine.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Java Visual Mode', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Just Vaue Memory', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Java Virtual Machine', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Javascript Variable Maker', false);

    -- Question 49: Integration
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is an API?', 'Application Programming Interface, allowing software to communicate.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Application Protocol Internet', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Automated Process Instruction', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Application Programming Interface', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Advanced Programming Instruction', false);

    -- Question 50: Development 
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "IDE" short for?', 'Integrated Development Environment (e.g., VS Code).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Internal Data Engine', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integrated Development Environment', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Internet Design Element', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Input Device Error', false);

    -- Question 51: Variables
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which variable type has "Global Scope"?', 'A variable accessible from anywhere in the program.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Local Variable', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Global Variable', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Private Variable', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Temporary Variable', false);

    -- Question 52: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'The condition "5 > 3" would evaluate to:', 'True.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'False', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'True', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Null', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Error', false);

    -- Question 53: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In OOP, a blueprint for creating objects is called a:', 'Class.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Method', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Class', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Key', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Loop', false);

    -- Question 54: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which language is used to style HTML elements?', 'CSS.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HTML', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'XML', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CSS', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SQL', false);

    -- Question 55: Data
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which is an example of a boolean value?', 'True.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '100', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '"Hello"', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'True', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '3.14', false);

    -- Question 56: Architecture
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'The "Server" in Client-Server architecture provides:', 'Resources or services (data, files) to the client.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The user interface', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The resources/services', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The power supply', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The keyboard input', false);

    -- Question 57: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which loop runs "While" a condition is true?', 'While Loop.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'For Loop', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'While Loop', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'If Statement', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Switch Case', false);

    -- Question 58: Data
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What stores multiple values of the same type in a single variable?', 'An Array (or List).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'String', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Array', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', false);

    -- Question 59: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Debugging"?', 'The process of finding and fixing errors in code.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Writing new code', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Creating a bug', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Finding and fixing errors', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compiling code', false);

    -- Question 60: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Machine code consists of:', 'Binary numbers (1s and 0s).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'English words', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Binary (1s and 0s)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HTML tags', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Decimal numbers', false);

    -- Question 61: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which step usually comes first in the software development process?', 'Requirements Analysis / planning.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Testing', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Maintenance', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Requirements Analysis', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Coding', false);

    -- Question 62: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which language is used to mark up data but has no predefined tags?', 'XML allows users to define their own tags.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HTML', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'XML', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Java', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'C', false);

    -- Question 63: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Float" data type usually requires more memory than an Integer because:', 'It stores decimal precision.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It is older', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It handles decimal numbers/precision', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It is text', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It is binary', false);

    -- Question 64: Architecture
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In a 3-tier architecture, where is the data typically stored?', 'The Data Layer (Database).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Presentation Layer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Logic Layer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data Layer / Database', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Network Layer', false);

    -- Question 65: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which control structure branches code execution based on multiple possible values (like a menu)?', 'Switch / Case statement.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'For Loop', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Switch / Case', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'While Loop', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Variable', false);

    -- Question 66: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does "QA" stand for in software development?', 'Quality Assurance.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Quick Access', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Quality Assurance', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Question Answer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Quantity Analysis', false);

    -- Question 67: Tools
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which tool converts Assembly language into Machine Code?', 'An Assembler.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compiler', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Interpreter', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Assembler', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Debugger', false);

    -- Question 68: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "While Loop" checks the condition:', 'Before execution of the loop body (Entry-controlled).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'After the loop body', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Before the loop body', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'During the loop body', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Never', false);

    -- Question 69: Data
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A list of related data of different types grouped together is often called:', 'A Record or Struct.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Array (usually same type)', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Record / Struct', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Variable', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Loop', false);

    -- Question 70: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Version Control" used for?', 'Tracking and managing changes to source code over time.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Controlling the CPU speed', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Tracking changes to code (Git)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compiling code', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Designing graphics', false);

    -- Question 71: Programming
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which is an example of a "High-Level" programming language?', 'Python (and Java, C#, etc.) are high-level.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Machine Code', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Assembly', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Python', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Binary', false);

    -- Question 72: Web
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which HTTP method is typically used to request data from a server?', 'GET.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'POST', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'GET', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DELETE', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PUT', false);

    -- Question 73: Variables
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'If you declare a variable inside a function, it typically has:', 'Local Scope (only visible inside that function).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Global Scope', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Universal Scope', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Local Scope', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'No Scope', false);

    -- Question 74: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does HTML use to define elements?', 'Tags (enclosed in angle brackets).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hashtags', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Angle Bracket Tags', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Curly Braces', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Parentheses', false);

    -- Question 75: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What symbol is commonly used for assignment (setting a value)?', 'The equals sign (=).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '==', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '=', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '!=', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '>=', false);

    -- Question 76: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which language is primarily used for querying databases?', 'SQL (Structured Query Language).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Java', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SQL', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'C++', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HTML', false);

    -- Question 77: Data
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Vector" in some languages is similar to an:', 'Array (a dynamic array).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Array', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Loop', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Comment', false);

    -- Question 78: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which software development model follows a linear, sequential path?', 'Waterfall model.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Agile', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Waterfall', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Scrum', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spiral', false);

    -- Question 79: Web
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'JavaScript files typically use which file extension?', '.js')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.java', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.js', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.html', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.css', false);

    -- Question 80: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which logic gate returns TRUE if inputs are different?', 'XOR (Exclusive OR).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'AND', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'XOR', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'OR', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'NOT', false);

    -- Question 81: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which language is "markup" rather than "programming"?', 'HTML (and XML) are Markup languages.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Python', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HTML', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'C', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Java', false);

    -- Question 82: Variables
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A variable name typically cannot start with:', 'A number.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A letter', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'An underscore', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A number', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A lowercase letter', false);

    -- Question 83: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does "Open Source" mean?', 'Software where the source code is freely available for use and modification.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Expensive software', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Source code is available to public', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Proprietary code', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'No source code exists', false);

    -- Question 84: Development
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which phase involves fixing bugs reported by users after release?', 'Maintenance.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Design', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Testing', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Maintenance', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Coding', false);

    -- Question 85: Data
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of these is typically the smallest unit of data?', 'Bit (0 or 1).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Byte', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Bit', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Kilobyte', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Megabyte', false);

    -- Question 86: Interpreted vs Compiled
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which runs faster generally: Compiled or Interpreted code?', 'Compiled code runs faster as it is already translated to machine code.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Interpreted', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compiled', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Both are same', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Scripting', false);

    -- Question 87: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'An "If-Else" statement is used for:', 'Decision Making (Branching).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Looping', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Decision Making', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Defining classes', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Storing files', false);

    -- Question 88: Compiling
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'The file created after compiling source code is often called a(n):', 'Executable (or binary).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Text file', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Executable', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spreadsheet', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Image', false);

    -- Question 89: Web
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does a web browser use to render a webpage?', 'An Engine (like Blink, WebKit, Gecko) that interprets HTML/CSS/JS.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A printer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Rendering Engine', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Compiler', false);

    -- Question 90: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term refers to the inputs passed to a function?', 'Arguments or Parameters.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Variables', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Arguments', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Returns', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Loops', false);

    -- Question 91: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Spaghetti Code"?', 'Unstructured and difficult-to-maintain source code.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Italian food recipe', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Unstructured / messy code', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Very fast code', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encrypted code', false);

    -- Question 92: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which language is used to create "Stored Procedures" in a database?', 'SQL (specifically dialects like T-SQL or PL/SQL).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HTML', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SQL', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CSS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'JavaScript', false);

    -- Question 93: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In logic, what is a "Truth Table"?', 'A table used to represent all possible values of logical variables and the result.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A list of lies', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A table of all logic input/output combinations', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A database table', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A spreadsheet', false);

    -- Question 94: Architecture
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which architecture involves services communicating over a network (e.g., REST)?', 'Microservices or Service-Oriented Architecture (SOA).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Monolithic', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Stand-alone', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Service-Oriented / Microservices', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Mainframe', false);

    -- Question 95: Development
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the "Agile" methodology?', 'An iterative software development approach focusing on flexibility and customer feedback.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A rigid, linear process', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'An iterative / flexible approach', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A programming language', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A database engine', false);

    -- Question 96: Data
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type stores a sequence of characters like "Hello"?', 'String.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'String', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Float', false);

    -- Question 97: Tools
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'GitHub is a platform primarily used for:', ' Hosting Git repositories for version control and collaboration.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hosting websites only', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hosting Git repositories / Version Control', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Playing games', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Editing videos', false);

    -- Question 98: Languages
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'PHP is a server-side scripting language used for:', 'Web Development.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Desktop apps', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Web Development', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Mobile games', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Drivers', false);

    -- Question 99: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Refactoring"?', 'Improving the internal structure of code without changing its external behavior.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Adding new features', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Improving code structure without changing behavior', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Deleting the code', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Writing documentation', false);

    -- Question 100: Logic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "nested loop" is:', 'A loop inside another loop.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A loop that never runs', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A loop inside another loop', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A fast loop', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A conditional statement', false);

END $$;
