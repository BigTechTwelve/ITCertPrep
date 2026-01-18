-- Content: Questions 1-30 for Domain 5.0 Database Fundamentals
DO $$
DECLARE
    cert_id UUID;
    obj_id UUID;
    q_id UUID;
BEGIN
    -- Look up the certification ID
    SELECT id INTO cert_id FROM certifications WHERE title = 'CompTIA Tech+ (FC0-U71)' LIMIT 1;
    
    -- Look up the objective ID for Domain 5.0
    SELECT id INTO obj_id FROM objectives WHERE certification_id = cert_id AND title = '5.0 Database Fundamentals' LIMIT 1;

    -- If identifiers are not found, raise an exception
    IF cert_id IS NULL OR obj_id IS NULL THEN
        RAISE EXCEPTION 'Certification or Objective not found. Ensure 5.0 Database Fundamentals exists.';
    END IF;

    -- Question 1: Database Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term describes a structured collection of data?', 'A Database.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Document', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Database', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Network', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'An Algorithm', false);

    -- Question 2: Relational Databases
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In a relational database, data is organized into:', 'Tables (with rows and columns).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Documents', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Tables', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Key-Value pairs', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Graphs', false);

    -- Question 3: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which SQL command is used to retrieve data from a database?', 'SELECT.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'INSERT', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'UPDATE', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SELECT', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DELETE', false);

    -- Question 4: Database Keys
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a "Primary Key"?', 'A unique identifier for each record in a table.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A password for the database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A unique identifier for a row', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The first column in a table', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A key used for encryption', false);

    -- Question 5: Non-Relational
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of database is often referred to as "NoSQL"?', 'Non-Relational databases.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Relational', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Non-Relational', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spreadsheet', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Flat File', false);

    -- Question 6: Relational Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does a "Foreign Key" represent?', 'A link to a Primary Key in another table, creating a relationship.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A key from another country', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A unique ID for the current table', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A link to a record in another table', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A password', false);

    -- Question 7: SQL Queries
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which SQL clause is used to filter records?', 'WHERE.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ORDER BY', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'GROUP BY', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'WHERE', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'JOIN', false);

    -- Question 8: Database Objects
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a "Query"?', 'Generally, a request for information from a database.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A database error', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A request for data', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A data backup', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A table definition', false);

    -- Question 9: Data Integrity
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Ensuring that data is accurate and consistent over its lifecycle is called:', 'Data Integrity.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data Redundancy', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data Integrity', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data Mining', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data Warehousing', false);

    -- Question 10: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term describes a single entry in a database table (a horizontal row)?', 'A Record (or Row/Tuple).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Field', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Column', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Record', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Table', false);

    -- Question 11: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does the SQL command "INSERT" do?', 'Adds new data/rows to a table.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Removes data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Modifies existing data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Adds new data', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Retrieves data', false);

    -- Question 12: Database Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Microsoft SQL Server, Oracle, and MySQL are examples of:', 'Relational Database Management Systems (RDBMS).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Operating Systems', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'RDBMS', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Web Browsers', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spreadsheets', false);

    -- Question 13: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which part of a database table holds a specific type of data (a vertical column)?', 'A Field (or Column/Attribute).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Record', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Row', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Field / Column', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Query', false);

    -- Question 14: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which command is used to modify existing records in a table?', 'UPDATE.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ALTER', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'MODIFY', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'UPDATE', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CHANGE', false);

    -- Question 15: Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "SQL Injection"?', 'A security vulnerability where an attacker interferes with database queries.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A way to speed up queries', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A security attack on database queries', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A data backup method', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A database installation tool', false);

    -- Question 16: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the purpose of database "Normalization"?', 'To minimize redundancy and improve data integrity.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To limit data size to 10MB', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To reduce redundancy / organize data efficiently', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To maximize duplication', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To encrypt the data', false);

    -- Question 17: Database Usage
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which would be best to store complex, hierarchical data like a product catalog with varying attributes?', 'A NoSQL (Document) database like MongoDB.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A text file', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Relational Table', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A NoSQL / Document Database', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A CSV file', false);

    -- Question 18: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does the "DELETE" command do?', 'Removes records from a table.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Deletes the table structure', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Removes rows of data', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Clears the screen', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Uninstalls the database', false);

    -- Question 19: Backup
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Database Dump" is essentially:', 'A full export of the database schema and data.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Deleting the database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A full export/backup of data', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A system crash', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A query error', false);

    -- Question 20: Relational
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "One-to-Many" relationship means:', 'One record in Table A relates to multiple records in Table B.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'One record matches only one record', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'One record relates to multiple records', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Everyone is related to everyone', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The tables are identical', false);

    -- Question 21: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which command creates a new table?', 'CREATE TABLE.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'NEW TABLE', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ADD TABLE', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CREATE TABLE', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'MAKE TABLE', false);

    -- Question 22: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a "Schema"?', 'The structural blueprint or definition of the database organization.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The physical hard drive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The data itself', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The structure / blueprint', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The administrator', false);

    -- Question 23: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type is appropriate for storing a date of birth?', 'Date (or DateTime).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Date', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Float', false);

    -- Question 24: SQL clauses
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'ORDER BY is used to:', 'Sort the result set.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Filter records', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Group records', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Sort the results', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Delete records', false);

    -- Question 25: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does DBMS stand for?', 'Database Management System.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data Basic Main System', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Database Management System', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Digital Binary Main Storage', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Daily Backup Management Service', false);

    -- Question 26: Usage
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Compared to a spreadsheet, a database is better for:', 'Multi-user access, scalability, and data integrity.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Quick calculations only', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Handling large volumes of structured data and multi-user access', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Writing letters', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Small lists of simple items', false);

    -- Question 27: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'The asterisk (*) in "SELECT * FROM Users" means:', 'Select all columns.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Select the most important column', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Select all columns', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Select nothing', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Multiply', false);

    -- Question 28: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is data "Redundancy"?', 'Unnecessary duplication of data.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data encryption', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Unnecessary duplication', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data speed', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data loss', false);

    -- Question 29: Access
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which user role typically has full control over the database structure and access?', 'Database Administrator (DBA).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'End User', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Guest', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Database Administrator (DBA)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Developer', false);

    -- Question 30: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does the clause "LIMIT 10" do in a query?', 'Restricts the result set to only 10 rows.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Runs the query 10 times', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Returns only the first 10 rows', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Waits 10 seconds', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ignores the first 10 rows', false);

    -- Question 31: Data Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term refers to raw facts and figures before they are processed?', 'Data.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Information', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Knowledge', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Wisdom', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data', true);

    -- Question 32: Relational Databases
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In a database, what implies that two tables are connected by a common field?', 'Relationship.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Normalization', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Relationship', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Replication', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encryption', false);

    -- Question 33: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which SQL command is used to remove a table and its data entirely from the database?', 'DROP TABLE.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DELETE TABLE', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'REMOVE TABLE', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DROP TABLE', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ERASE TABLE', false);

    -- Question 34: Usage
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which application is primarily used for creating and analyzing spreadsheets, not managing relational databases?', 'Microsoft Excel.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'MySQL', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PostgreSQL', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Microsoft Excel', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Microsoft Access', false);

    -- Question 35: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does "Big Data" typically refer to?', 'Datasets that are too large or complex for traditional data-processing application software.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Large font sizes', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data that is 100MB or larger', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Massive, complex datasets', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Capitalized letters', false);

    -- Question 36: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Specific rules that ensure the validity of data (e.g., age cannot be negative) are called:', 'Constraints (or Validation Rules).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Constraints', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Indexes', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Views', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Triggers', false);

    -- Question 37: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which keyword combines records from two tables?', 'JOIN.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'LINK', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ADD', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'JOIN', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ATTACH', false);

    -- Question 38: Structures
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A column that uniquely identifies each row (like an ID) is the:', 'Primary Key.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Foreign Key', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Secondary Key', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Primary Key', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Index Key', false);

    -- Question 39: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Processed data that provides context, relevance, and meaning is known as:', 'Information.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Information', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Input', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Bit', false);

    -- Question 40: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'To sort results in descending order, you use:', 'DESC.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'UP', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DOWN', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ASC', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DESC', true);

    -- Question 41: Structures
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'An "Index" in a database is used primarily to:', 'Speed up data retrieval operations.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encrypt data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Backup data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Speed up searches / retrieval', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Slow down write operations', false);

    -- Question 42: NoSQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Key-Value stores (like Redis) are a type of:', 'NoSQL database.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Relational Database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'NoSQL Database', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Desktop App', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Operating System', false);

    -- Question 43: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Query Language" allows you to:', 'Ask the database questions and manipulate data.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Physically clean the hard drive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Manipulate and retrieve data', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Design graphics', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Manage internet connection', false);

    -- Question 44: Storage
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Where is a database usually hosted in an enterprise environment?', 'On a dedicated Server (Database Server).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'On a USB drive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'On every employee''s laptop', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'On a dedicated Database Server', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'On a printer', false);

    -- Question 45: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which is NOT a standard database operation (CRUD)?', 'Restart.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Create', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Read', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Update', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Restart', true);

    -- Question 46: Data
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Storing a person''s age as "Twenty-Five" instead of 25 would likely violate data type constraints for which type?', 'Integer.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'String', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer / Number', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Text', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Blob', false);

    -- Question 47: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What creates a virtual table based on the result-set of an SQL statement?', 'A View.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Trigger', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Stored Procedure', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A View', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Primary Key', false);

    -- Question 48: Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which concept ensures that users only have access to the data they are permitted to see?', 'Access Control / Permissions.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Backup', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Latency', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Access Control', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Replication', false);

    -- Question 49: Integration
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'How does a backend application typically connect to a database?', 'Using a Connection String and Driver.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Via Bluetooth only', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using a Connection String', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'By emailing the database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using an HTML tag', false);

    -- Question 50: Backup
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Full Backup" copies:', 'All valid data in the database.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Only data changed since yesterday', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Only the user accounts', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Everything / All data', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The operating system files only', false);

    -- Question 51: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term describes inconsistent data in different places (e.g., address updated in shipping but not billing)?', 'Data Inconsistency (Anomaly).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data Integrity', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data Inconsistency', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data Security', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data Normalization', false);

    -- Question 52: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'To find all customers whose name starts with "A", which operator would you likely use?', 'LIKE (with a wildcard).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'EQUALS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'LIKE', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'GREATER THAN', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'IS', false);

    -- Question 53: Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Metadata"?', 'Data about data (e.g., table names, column types).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The main data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data about data', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Deleted data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Future data', false);

    -- Question 54: Transactions
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Transaction" ensures that:', 'A series of operations either all succeed or all fail (ACID properties).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data is public', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Operations are all-or-nothing', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Backups are automatic', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Queries are free', false);

    -- Question 55: Reports
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A tool that visualizes database data into charts and graphs is often called:', 'A Reporting / Business Intelligence (BI) tool.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'An Assembler', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Reporting / BI Tool', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Compiler', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Debugger', false);

    -- Question 56: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which wildcard character typically represents "zero or more characters" in SQL?', '% (Percent sign).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '*', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '%', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '&', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '#', false);

    -- Question 57: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a "Flat File" database?', 'A simple file (like CSV or TXT) where records follow a uniform format without complex relationships.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A 3D database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A complex relational system', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A simple file like CSV / TXT', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'An encrypted volume', false);

    -- Question 58: Integrity
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'If a user tries to leave a "NOT NULL" field empty, the database accepts it:', 'False, it will reject the action.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'True', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'False', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It depends on the time of day', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It creates a new table', false);

    -- Question 59: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term refers to the maximum number of connections or data volume a database can handle?', 'Scalability / Capacity.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Resolution', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Scalability', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Normalization', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Redundancy', false);

    -- Question 60: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which function would you use to count the number of rows in a result?', 'COUNT().')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SUM()', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'AVG()', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'COUNT()', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'MAX()', false);

    -- Question 61: Database Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term describes ensuring that database transactions are reliable (ACID)?', 'Atomicity (one of the ACID properties).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Elasticity', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Atomicity', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Fluidity', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Bandwidth', false);

    -- Question 62: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which clause identifies the table(s) to retrieve data from?', 'FROM.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'INTO', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'FROM', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'WITH', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'AT', false);

    -- Question 63: Integrity
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Referential Integrity ensures that:', 'Relationships between tables remain consistent (e.g., Foreign Key points to existing Primary Key).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Databases are fast', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Relationships are valid/consistent', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Backups are encrypted', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Passwords are strong', false);

    -- Question 64: Access
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which database method allows direct programmatic access to data?', 'ODBC / JDBC (Database Connectivity drivers).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HTML', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ODBC / JDBC', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CSS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'FTP', false);

    -- Question 65: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Stored Procedure" is:', 'A set of SQL statements saved and executed on the database server.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A saved spreadsheet', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A set of saved SQL statements', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A backup file', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A user account', false);

    -- Question 66: Data
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of data is unstructured?', 'Video files (or audio, images).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Relational Tables', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CSV files', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Video / Audio files', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'XML files', false);

    -- Question 67: Structure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the "Schema" of a database?', 'The logical configuration or structure of the database objects.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The actual data records', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The physical server', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The structure / configuration', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The network cable', false);

    -- Question 68: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does the "MIN()" function return?', 'The smallest value in a column.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The average value', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The largest value', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The smallest value', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The total sum', false);

    -- Question 69: Data Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which is considered "Structured Data"?', 'Data in a relational database table.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Email body text', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Social media posts', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Relational Database Table', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Audio recording', false);

    -- Question 70: Normalization
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'First Normal Form (1NF) typically requires:', 'Eliminating duplicate columns and ensuring atomicity (atomic values).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Creating backups', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encrypting data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Atomic values / No repeating groups', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Writing stored procedures', false);

    -- Question 71: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'The "AND" operator in a WHERE clause requires:', 'Both conditions to be true.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Only one condition to be true', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Both conditions to be true', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Neither condition to be true', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The query to fail', false);

    -- Question 72: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Database "Replication" involves:', 'Copying data to multiple servers for redundancy.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Deleting data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Copying data to other servers', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compressing data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Visualizing data', false);

    -- Question 73: Data Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type stores True or False values?', 'Boolean.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'String', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Decimal', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integers', false);

    -- Question 74: Usage
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which is an advantage of a Relational Database over a Flat File?', 'Concurrent user support and data integrity.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Simplicity for single user', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Concurrent access / Data Integrity', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'No installation required', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Uses less disk space always', false);

    -- Question 75: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which statement is used to add a new column to an existing table?', 'ALTER TABLE.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'UPDATE TABLE', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CHANGE TABLE', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ALTER TABLE', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'MODIFY TABLE', false);

    -- Question 76: Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which principle means granting users only the permissions they need to do their job?', 'Least Privilege.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Most Privilege', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Administrator Access', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Least Privilege', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Open Access', false);

    -- Question 77: Data
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Semi-structured data (like JSON or XML) is often used for:', 'Data exchange between systems.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Physical storage', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data exchange / Configuration', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Binary execution', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Printing', false);

    -- Question 78: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Primary Key" must contain:', 'Unique values and cannot be NULL.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Duplicate values', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Null values', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Unique / Non-Null values', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Only numbers', false);

    -- Question 79: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which aggregate function calculates the mean of a numeric column?', 'AVG().')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SUM()', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'MEAN()', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'AVG()', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'COUNT()', false);

    -- Question 80: NoSQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which database type is designed to scale horizontally across many servers easily?', 'NoSQL.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'MS Access', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'NoSQL', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spreadsheets', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Flat files', false);

    -- Question 81: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term refers to the speed at which a database responds to requests?', 'Performance / Latency.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Storage size', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Performance / Latency', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Redundancy', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integrity', false);

    -- Question 82: Use Cases
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'For a bank application tracking transfers, which database property is critical?', 'ACID (specifically consistency and atomicity).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Casual consistency', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ACID Compliance', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'High latency', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'No backup', false);

    -- Question 83: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'The "OR" operator in SQL returns true if:', 'At least one of the conditions is true.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Both conditions are true', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'At least one condition is true', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Neither is true', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The table is empty', false);

    -- Question 84: Structures
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In an Entity-Relationship Diagram (ERD), a rectangle typically represents:', 'An Entity (Table).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'An Attribute', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'An Entity', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Relationship', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Query', false);

    -- Question 85: Access
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which SQL command is used to grant permissions to a user?', 'GRANT.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ALLOW', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PERMIT', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'GRANT', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'GIVE', false);

    -- Question 86: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Data Mining"?', 'Analyzing large datasets to discover patterns and trends.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Deleting old data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Analyzing data for patterns', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Backing up data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Entering data manually', false);

    -- Question 87: Backup
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which backup type copies only data that changed since the last backup?', 'Incremental (or Differential).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Full Backup', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Incremental Backup', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Cold Backup', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Manual Backup', false);

    -- Question 88: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which data type is best for storing large blocks of text?', 'Text (or Clob/Blob).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Boolean', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Text / LongText', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Date', false);

    -- Question 89: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a "Composite Key"?', 'A Primary Key that consists of two or more columns.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A very strong key', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A key made of plastic', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A Primary Key of multiple columns', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A foreign key', false);

    -- Question 90: Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does data "Encryption" do?', 'Encodes data so unauthorized users cannot read it.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Deletes data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encodes data for security', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compresses data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Speeds up access', false);

    -- Question 91: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which concept refers to the ability to increase database resources (CPU/RAM) on a single server?', 'Vertical Scaling (Scaling Up).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Horizontal Scaling', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Vertical Scaling', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Sharding', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Partitioning', false);

    -- Question 92: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which SQL keyword is used to remove duplicates from a result set?', 'DISTINCT.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'UNIQUE', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DIFFERENT', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DISTINCT', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'REMOVE', false);

    -- Question 93: Use Case
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which database is typically embedded directly into mobile apps (Android/iOS)?', 'SQLite.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Oracle Enterprise', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SQLite', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SQL Server', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'MongoDB', false);

    -- Question 94: Backup
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the purpose of a "Transaction Log"?', 'To record all changes to the database to aid in recovery.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To store user passwords', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To record all changes for recovery', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To slow down the database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To generate reports', false);

    -- Question 95: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which relationship exists between a "Student" table and a "Class" table where students can take many classes and classes have many students?', 'Many-to-Many.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'One-to-One', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'One-to-Many', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Many-to-Many', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'None', false);

    -- Question 96: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which operator checks if a value creates a match in a list of values?', 'IN.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'BETWEEN', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'LIKE', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'IN', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'EXISTS', false);

    -- Question 97: Structure
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In a database, "Constraints" are used to:', 'Enforce rules on data (e.g., uniqueness, not null).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Speed up queries', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Enforce rules on data', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Backup data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Connect to the internet', false);

    -- Question 98: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is data "Persistence"?', 'Data surviving after the application or system is turned off.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data disappearing on reboot', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data surviving after power off', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data moving very fast', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data encryption', false);

    -- Question 99: SQL
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'To group rows that have the same values into summary rows, you use:', 'GROUP BY.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ORDER BY', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SORT BY', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'GROUP BY', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ARRANGE BY', false);

    -- Question 100: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of these is a valid reason to use a database over a text file?', 'Easy, improved concurrent access and querying capabilities.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Text files have better security', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It is simpler for 1 record', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Improved concurrent access / Querying', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Text files are obsolete', false);

END $$;
