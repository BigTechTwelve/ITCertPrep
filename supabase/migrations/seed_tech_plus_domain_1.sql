-- Tech+ Domain 1.0: IT Concepts and Terminology
-- Generated Questions

DO $$
DECLARE
    cert_id UUID;
    obj_id UUID;
    q_id UUID;
BEGIN
    -- Get Certification ID
    SELECT id INTO cert_id FROM certifications WHERE title = 'CompTIA Tech+ (FC0-U71)';

    -- Get Objective ID for 1.0
    SELECT id INTO obj_id FROM objectives WHERE title = '1.0 IT Concepts and Terminology' AND certification_id = cert_id;

    -- Question 1: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of the following numbering systems uses base-16?', 'Hexadecimal is a base-16 numbering system using digits 0-9 and letters A-F.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Binary', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Decimal', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hexadecimal', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ASCII', false);

    -- Question 2: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type would be most appropriate for storing a user''s age?', 'An integer is a whole number, which is appropriate for age. Floats are for decimals, Strings for text, and Booleans for true/false.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'String', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Float', false);

    -- Question 3: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'How many bits are in one byte?', 'There are 8 bits in 1 byte.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '4', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '8', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '16', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '1024', false);

    -- Question 4: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the FIRST step in the CompTIA troubleshooting methodology?', 'The first step is to Identify the Problem. This involves gathering information and duplicating the issue if possible.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Establish a theory of probable cause', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Test the theory to determine the cause', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Identify the problem', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Document findings', false);

    -- Question 5: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the decimal equivalent of the binary number 1010?', 'Binary 1010 = (1*8) + (0*4) + (1*2) + (0*1) = 8 + 2 = 10.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '5', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '10', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '12', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '101', false);

    -- Question 6: Data Representation
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which character encoding standard uses 7 bits to represent characters?', 'ASCII uses 7 bits (0-127) to represent characters. Unicode is a superset that uses more bits.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Unicode', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'UTF-8', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ASCII', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hex', false);

    -- Question 7: Computing Basic
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of the following describes the "Processing" stage of the IPOS model?', 'Processing involves converting input into output using the CPU and memory.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Entering data via keyboard', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Displaying an image on a monitor', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Saving a file to the hard drive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Calculating a spreadsheet formula', true);

    -- Question 8: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which unit is typically used to measure network transmission speed?', 'Network speed (throughput) is typically measured in bits per second (e.g., Mbps, Gbps). Storage is measured in bytes (MB, GB).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Megabytes (MB)', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Megabits per second (Mbps)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Gigahertz (GHz)', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Terabytes (TB)', false);

    -- Question 9: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'After implementing a solution to a problem, what should you do NEXT according to the troubleshooting model?', 'After implementing a solution, you should verify full system functionality and, if applicable, implement preventive measures.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Document the findings', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Verify full system functionality', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Establish a plan of action', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Test the theory', false);

    -- Question 10: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which value represents a Boolean data type?', 'Boolean values are strictly True or False (or 1/0).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '"True"', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '10.5', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'TRUE', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'abc', false);

    -- Question 11: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the largest value that can be represented by a single hexadecimal digit?', 'F is the largest hexadecimal digit, representing the value 15.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '9', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '10', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '15', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '16', false);

    -- Question 12: Storage
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of the following prefix orders is correct from SMALLEST to LARGEST?', 'Kilo < Mega < Giga < Tera < Peta.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'KB, GB, MB, TB', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'TB, PB, GB, MB', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'MB, GB, TB, PB', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PB, TB, GB, MB', false);

    -- Question 13: Processing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which hardware component is primarily responsible for the "Processing" function?', 'The CPU (Central Processing Unit) is the primary brain responsible for processing instructions.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hard Drive (HDD)', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'RAM', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CPU', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Monitor', false);

    -- Question 14: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'You have established a theory of probable cause. What is the next step?', 'After establishing a theory, you must test the theory to see if it is correct.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Implement the solution', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Test the theory', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Establish a plan of action', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Identify the problem', false);

    -- Question 15: Data Representation
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'How many values can be represented by 8 bits?', '2^8 = 256. An 8-bit byte can represent values from 0 to 255.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '128', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '255', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '256', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '512', false);

    -- Question 16: Input Devices
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of the following is primarily an input device?', 'A microphone captures audio input. Speakers, Monitors, and Printers are output devices.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Speaker', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Monitor', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Microphone', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Printer', false);

    -- Question 17: Output Devices
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which device is used to produce a hard copy of digital documents?', 'A printer produces a physical (hard) copy of digital data.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Scanner', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Printer', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Webcam', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Projector', false);

    -- Question 18: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which troubleshooting step involves asking the user clarifying questions?', 'Identifying the problem includes inquiring about what happened, error messages, and recent changes.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Identify the problem', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Establish a theory', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Test the theory', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Verify functionality', false);

    -- Question 19: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which frequency unit is commonly used to measure CPU speed?', 'CPU speed (clock speed) is measured in Hertz (Hz), commonly Gigahertz (GHz).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Bits per second (bps)', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Bytes (B)', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hertz (Hz)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Pixels (px)', false);

    -- Question 20: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A variable storing the value 3.14159 is best classified as which data type?', 'A Float (Floating Point) represents numbers with decimal points.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Char', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Float', true);

    -- Question 21: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which concept refers to the specific set of characters a computer can recognize?', 'Character encoding (like ASCII or UTF-8) defines the character set a computer recognizes.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Clock Speed', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Resolution', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Character Encoding', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encryption', false);

    -- Question 22: Processing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which component provides temporary high-speed access to data for the CPU?', 'RAM (Random Access Memory) provides high-speed, volatile temporary storage for active data.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hard Drive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SSD', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'RAM', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Optical Drive', false);

    -- Question 23: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'You verify that a system is functioning correctly after a fix. What else should you do in this step?', 'Step 5 is Verify full system functionality and, if applicable, implement preventive measures.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Purchase new hardware', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Implement preventive measures', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Reinstall the OS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Escalate the ticket', false);

    -- Question 24: Computing Basics
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which stage of the IPOS model involves saving a document to a USB drive?', 'Saving data for long-term retention is the Storage stage.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Input', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Processing', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Output', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Storage', true);

    -- Question 25: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does the abbreviation "bit" stand for?', 'Bit stands for Binary Digit.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Basic Integer Type', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Binary Digit', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Byte Interchange Tech', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Base Integer Total', false);

    -- Question 26: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type is a single letter, number, or symbol?', 'A Char (Character) represents a single alphanumeric character.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'String', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Char', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Float', false);

    -- Question 27: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of these is approximately one trillion bytes?', 'A Terabyte (TB) is approximately one trillion bytes (10^12) or 2^40 depending on definition.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Gigabyte', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Terabyte', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Petabyte', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Exabyte', false);

    -- Question 28: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'If your first theory of probable cause turns out to be incorrect, what should you do?', 'If the theory is incorrect, you should re-evaluate and establish a new theory based on your findings.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Give up', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Establish a new theory', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Implement the failed solution anyway', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Skip to Step 5', false);

    -- Question 29: Computing Basics
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type would you use to store a user''s email address?', 'An email address is a sequence of characters, so a String is the appropriate data type.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Char', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'String', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', false);

    -- Question 30: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the FINAL step in the troubleshooting process?', 'The final step is to Document findings, actions, and outcomes to help with future issue resolution.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Verify functionality', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Identify the problem', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Document findings', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Test the theory', false);

    -- Question 31: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which hexadecimal value represents the decimal number 10?', 'In Hexadecimal, 0-9 represent values 0-9, and A-F represent 10-15. Thus, A = 10.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'B', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'C', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '10', false);

    -- Question 32: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type is best suited for a flag indicating if a light is On or Off?', 'Access state is binary (On/Off), perfectly suited for a Boolean.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'String', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Float', false);

    -- Question 33: Computing Basics
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of the following is an example of an Operating System?', 'Microsoft Windows is an OS. Intel Core is a CPU, Google Chrome is an application, and Dell XPS is a hardware model.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Google Chrome', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Microsoft Windows', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Intel Core i7', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Dell XPS', false);

    -- Question 34: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'You have a file size of 5 MB. How many KB is this approximately?', '1 MB is approximately 1000 KB (or 1024 KB). 5 * 1024 = 5120 KB.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '50 KB', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '500 KB', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '5000 KB', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '50,000 KB', false);

    -- Question 35: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'When determining the cause of a problem, what is helpful to check FIRST?', 'Checking logs or error messages is often the most critical initial step to determine the cause.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Replace the motherboard', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Reinstall the application', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Check system logs/error messages', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Format the drive', false);

    -- Question 36: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Why do computers primarily use the binary numbering system?', 'Transistors, the building blocks of computers, have two states: On (1) and Off (0).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It is easier for humans to read', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It uses less storage space than decimal', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Transistors have two states (On/Off)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It supports more colors', false);

    -- Question 37: Data Representation
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term represents a single element in a database table (a row)?', 'A Record (or Row) represents a single structured data item in a table.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Field', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Character', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Record', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Query', false);

    -- Question 38: Processing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which component handles the graphical processing for a computer?', 'The GPU (Graphics Processing Unit) is specialized for rendering images, video, and 3D graphics.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CPU', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'RAM', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PSU', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'GPU', true);

    -- Question 39: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'You are trying to test a theory but are unable to confirm it. What should you do?', 'If you cannot confirm a theory, establish a new one or escalate the issue. Sticking to a wrong path wastes time.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Assume it is true', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Establish a new theory or escalate', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Document it as the cause', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Replace the computer', false);

    -- Question 40: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of the following represents the fastest data transfer rate?', '1 Gbps = 1000 Mbps. 1 Tbps = 1000 Gbps. Therefore 10 Gbps > 1000 Mbps (1Gbps). 1 Tbps is fastest.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '10 Mbps', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '1000 Mbps', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '10 Gbps', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '1 Tbps', true);

    -- Question 41: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the base of the Decimal numbering system?', 'Decimal is base-10 (digits 0-9).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '2', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '8', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '10', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '16', false);

    -- Question 42: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type would be appropriate for a phone number like "+1-555-0199"?', 'Because of the hyphen and plus sign, a String is required. Integers generally cannot store formatting characters.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Float', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'String', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', false);

    -- Question 43: Computing Basics
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A generic term for physical parts of a computer system is:', 'Hardware refers to the physical components of a computer.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Software', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Firmware', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hardware', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Middleware', false);

    -- Question 44: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Why is it important to document findings in the troubleshooting process?', 'Documentation creates a knowledge base that can speed up future repairs and provides a history of changes.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To prove who caused the problem', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To provide a history and aid future troubleshooting', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It is required for warranty purposes only', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To delay the next ticket', false);

    -- Question 45: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which ASCII character is represented by the decimal value 65?', 'In ASCII, 65 is the code for uppercase ''A''.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'a', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '0', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SPACE', false);

    -- Question 46: Computing Basics
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of the following is considered "Volatile" memory?', 'RAM loses its data when power is removed, making it volatile. ROM, HDD, and Flash Drives retain data without power (non-volatile).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hard Disk Drive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Flash Drive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'RAM', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ROM', false);

    -- Question 47: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'One Petabyte (PB) is equal to approximately how many Terabytes (TB)?', '1024 Terabytes make 1 Petabyte.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '10', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '100', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '1000', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '1,000,000', false);

    -- Question 48: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Before implementing a solution that changes a critical system configuration, what should you do?', 'Always back up critical data or configuration before making changes to ensure you can revert if something goes wrong.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Reboot the system', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Back up data/configuration', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Close the ticket', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Format the disk', false);

    -- Question 49: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type is typically used to represent currency in a robust application?', 'While Floats can be used, Decimals or specific Currency types are preferred to avoid floating-point errors. Out of these options, Float is the closest numeric type for decimals.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Float', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Char', false);

    -- Question 50: Computing Basics
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of the following is strictly an OUTPUT device?', 'A Monitor displays data. A Touchscreen and Multifunction Printer are Input/Output. A Scanner is Input.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Touchscreen Monitor', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Scanner', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Standard Monitor', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Multifunction Printer', false);

    -- Question 51: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A user cannot print. You suspect the printer is out of paper. Which troubleshooting step are you performing?', 'Checking if the printer is out of paper is "Testing the Theory" to determine the cause.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Identifying the problem', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Testing the theory', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Establishing a plan', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Verifying functionality', false);

    -- Question 52: Storage - IOPS
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which Metric measures the number of read/write operations a storage device can handle per second?', 'IOPS stands for Input/Output Operations Per Second.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'RPM', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Latency', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'IOPS', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Throughput', false);

    -- Question 53: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the sum of Binary 0101 and Binary 0010?', '0101 (5) + 0010 (2) = 0111 (7).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '0110', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '0111', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '1000', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '0011', false);

    -- Question 54: Computing Basics - Applications
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of software is designed to perform a specific task for a user, like word processing?', 'Application software (or "Apps") is designed for end-users to perform specific tasks.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'System Software', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Utility Software', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Application Software', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Firmware', false);

    -- Question 55: Data Types - Char
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of the following values is best stored as a Char?', 'A middle initial is a single letter, perfect for a Char data type.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The word "Hello"', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The number 42', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A middle initial "J"', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A price $10.99', false);

    -- Question 56: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which unit is used to measure the resolution of a printed image?', 'DPI (Dots Per Inch) measures print resolution. PPI is for screens.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hz', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DPI', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'FPS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Gbps', false);

    -- Question 57: Computing Basics - Processing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A CPU that has two separate processing units embedded is known as what?', 'A Dual-core processor has two processing units (cores).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Single-core', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Dual-core', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hyper-threaded', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '64-bit', false);

    -- Question 58: Data Representation
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which character set Unicode is compatible with because the first 128 characters are identical?', 'Unicode was designed to be backward compatible with ASCII.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'EBCDIC', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ASCII', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ANSI', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'UTF-32', false);

    -- Question 59: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'You verify the system functionality is restored, but the user is concerned it might happen again. What step helps with this?', 'Implementing preventive measures protects the system from future occurrences of the same issue.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Implement preventive measures', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Document findings', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Test the theory', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Establish a plan of action', false);

    -- Question 60: I/O Devices
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A touchscreen kiosk at an airport is an example of which type of device?', 'Touchscreens act as both an input device (touch) and an output device (display).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Input only', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Output only', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Input/Output (Hybrid)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Processing', false);

    -- Question 61: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'How many values can a 4-bit number represent?', '2^4 = 16. It can represent values 0-15.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '4', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '8', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '16', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '32', false);

    -- Question 62: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What happens if you skip "Identify the Problem" and jump straight to a solution?', 'Jumping to a solution without proper identification leads to guessing, which is inefficient and may fix the wrong thing.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'You save time', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'You might implement an incorrect fix', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The problem essentially solves itself', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'This is the standard procedure', false);

    -- Question 63: Computing Basics - Storage
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which storage technology uses magnetic platters to store data?', 'HDD (Hard Disk Drives) use spinning magnetic platters. SSDs use Flash memory.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SSD', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Flash Drive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HDD', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Optical Disc', false);

    -- Question 64: Data Types - String
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Combining two strings together into one is known as what?', 'Concatenation is the operation of joining character strings end-to-end.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compilation', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Concatenation', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Computation', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Conversion', false);

    -- Question 65: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which unit describes the number of times a monitor refreshes the screen per second?', 'Hertz (Hz) is the unit for refresh rate.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'FPS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PPI', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hz', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Lumens', false);

    -- Question 66: Computing Basics
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which component converts AC power from the wall into DC power for the computer?', 'The PSU (Power Supply Unit) converts AC to DC.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CPU', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Motherboard', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PSU', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'UPS', false);

    -- Question 67: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'If a problem is beyond your knowledge or permission level, what should you do?', 'Escalating the problem to a higher-tier technician or supervisor is the correct step if you cannot resolve it.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Guess the solution', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Leave the ticket open indefinitely', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Escalate the problem', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Tell the user it cannot be fixed', false);

    -- Question 68: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which Notational system uses digits 0-7?', 'Octal is base-8.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Binary', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Decimal', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Octal', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hexadecimal', false);

    -- Question 69: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the term for a whole number that can be positive or negative?', 'An Integer includes both positive and negative whole numbers.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Unsigned Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Signed Integer', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Float', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Char', false);

    -- Question 70: Computing Basics - IPOS
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A document being sent to a network printer is an example of which IPOS stage?', 'The data is leaving the computer system, so it is Output.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Input', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Processing', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Storage', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Output', true);

    -- Question 71: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which tool would you generally use to research error codes provided by a system?', 'Search engines and vendor knowledge bases are the primary tools for researching error codes.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Calculator', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Multimeter', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Knowledge Base / Search Engine', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Screw driver', false);

    -- Question 72: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which prefix represents 1,000,000 (one million)?', 'Mega represents 10^6.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Kilo', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Mega', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Giga', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Tera', false);

    -- Question 73: Data Representation
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In a database, what is a primary key used for?', 'A Primary Key uniquely identifies each record in a table.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To encrypt the data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To verify data types', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To uniquely identify a record', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To store large text', false);

    -- Question 74: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which binary number equals decimal 3?', 'Binary 0011 is 2 + 1 = 3.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '0001', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '0010', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '0011', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '0100', false);

    -- Question 75: Computing Basics
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Internal components like the CPU and RAM plug directly into which main circuit board?', 'The Motherboard connects all internal components.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hard Drive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Power Supply', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Motherboard', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Network Card', false);

    -- Question 76: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which numbering system is used by MAC addresses?', 'MAC addresses are typically represented in Hexadecimal.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Binary', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Decimal', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hexadecimal', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Octal', false);

    -- Question 77: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which Boolean operator returns TRUE only if BOTH inputs are TRUE?', 'The AND operator requires both conditions to be true.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'OR', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'NOT', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'AND', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'XOR', false);

    -- Question 78: Computing Basics - Processing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does the clock speed of a CPU determine?', 'The clock speed determines the rate at which the CPU can execute instructions (cycles per second).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The amount of data it can store', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The rate at which it executes instructions', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The resolution of the screen', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The internet speed', false);

    -- Question 79: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which unit is used to measure the power output of a Power Supply Unit (PSU)?', 'PSU capability is rated in Watts.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Volts', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Amps', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Watts', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ohms', false);

    -- Question 80: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'You verify the system works, but notice a loud fan noise that wasn''t there before. What should you do?', 'New issues arising from a repair must be addressed. Documenting it is fine, but you should Identify the new problem or re-evaluate.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ignoring it as the original issue is fixed', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Identify the new problem', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Close the ticket immediately', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Tell the user it is normal', false);

    -- Question 81: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the decimal value of the binary number 0001?', '0001 is equal to 1 in decimal.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '0', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '1', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '2', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '4', false);

    -- Question 82: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type is composed of a collection of characters?', 'A String is a sequence (collection) of characters.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'String', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Char', false);

    -- Question 83: Computing Basics
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which connector is primarily used for high-definition video and audio output?', 'HDMI (High-Definition Multimedia Interface) carries both video and audio.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'USB-A', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'VGA', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HDMI', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ethernet', false);

    -- Question 84: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'If you cannot reproduce a problem, what is a good strategy?', 'Asking the user to demonstrate the problem or explain exactly when it happens helps gather more info.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Assume the user is lying', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Close the ticket as "No Fault Found"', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ask the user to demonstrate the issue', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Replace the entire system', false);

    -- Question 85: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'How many Gigabytes (GB) are in 2 Terabytes (TB)?', '1 TB = 1024 GB (approx). 2 TB = 2048 GB.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '1000', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '2000', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '2048', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '500', false);

    -- Question 86: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which system uses Base-2?', 'Binary is Base-2 (0 and 1).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Decimal', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Binary', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hexadecimal', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Unary', false);

    -- Question 87: Data Representation
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term describes reducing file size to save storage space?', 'Compression reduces file size.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encryption', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compression', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Defragmentation', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Partitioning', false);

    -- Question 88: Computing Basics
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which device allows multiple computers to connect to a network?', 'A Switch connects devices within a network. A Router connects networks together.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Monitor', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Switch', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hard Drive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Printer', false);

    -- Question 89: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Why must you establish a theory of probable cause?', 'You need a starting hypothesis to test against. Without a theory, you are just guessing randomly.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To narrow the scope of the problem', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To document the fix', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To verify system functionality', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To determine user error', false);

    -- Question 90: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which unit measures electrical resistance?', 'Ohms measure resistance.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Volts', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Amps', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Watts', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ohms', true);

    -- Question 91: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type uses TRUE/FALSE values?', 'Boolean data types represent logic states like True/False.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Float', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'String', false);

    -- Question 92: Computing Basics - Output
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A video projector is considered which type of device?', 'A Projector outputs visual data, similar to a monitor.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Input', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Storage', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Output', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Processing', false);

    -- Question 93: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'When documenting your findings, what should you include?', 'Include the description of the problem, the solution, and the date. This helps build a history.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Only your name', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Problem description, solution, and date', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The user''s password', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A complaint about the user', false);

    -- Question 94: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Hexadecimal F represents which decimal number?', 'F is the 16th symbol (0-9, A-F), representing value 15.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '10', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '12', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '15', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '16', false);

    -- Question 95: Units of Measure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which prefix means one billion?', 'Giga means 10^9, or one billion.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Mega', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Giga', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Tera', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Micro', false);

    -- Question 96: Data Representation
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the smallest unit of data in a computer?', 'A Bit (Binary Digit) is the smallest unit (0 or 1).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Byte', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Bit', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Nibble', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Word', false);

    -- Question 97: Computing Basics
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which software manages memory and processes?', ' The Operating System (OS) manages hardware resources like memory and CPU processes.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Application', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Operating System', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spreadsheet', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Database', false);

    -- Question 98: Troubleshooting
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which question is most helpful to identify a problem?', '"What changed recently?" often points directly to the cause (updates, new software, moved cables).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'What is your password?', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Did you break it?', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'What changed since it last worked?', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'How much did this cost?', false);

    -- Question 99: Notational Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which numbering system uses base-10?', 'Decimal is the base-10 system we use in daily life.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Binary', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Octal', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Decimal', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hexadecimal', false);

    -- Question 100: Computing Basics - IPOS
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Using a keyboard to type a letter is which part of the IPOS cycle?', 'Typing is providing Input to the computer.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Input', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Processing', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Output', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Storage', false);

END $$;
