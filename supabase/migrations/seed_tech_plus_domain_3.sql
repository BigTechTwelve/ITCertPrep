-- Content: Questions 1-30 for Domain 3.0 Applications and Software
DO $$
DECLARE
    cert_id UUID;
    obj_id UUID;
    q_id UUID;
BEGIN
    -- Look up the certification ID
    SELECT id INTO cert_id FROM certifications WHERE title = 'CompTIA Tech+ (FC0-U71)' LIMIT 1;
    
    -- Look up the objective ID for Domain 3.0
    SELECT id INTO obj_id FROM objectives WHERE certification_id = cert_id AND title = '3.0 Applications and Software' LIMIT 1;

    -- If identifiers are not found, raise an exception
    IF cert_id IS NULL OR obj_id IS NULL THEN
        RAISE EXCEPTION 'Certification or Objective not found. Ensure 3.0 Applications and Software exists.';
    END IF;

    -- Question 1: OS Functions
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which software manages the computer''s hardware and software resources and provides common services for computer programs?', 'The Operating System (OS) manages hardware and software resources.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'BIOS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Operating System', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Device Driver', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hypervisor', false);

    -- Question 2: Application Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of application is accessed through a web browser and requires no local installation?', 'Web Applications are accessed via browser and run on a remote server.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Locally installed', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Portable app', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Web Application', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Native app', false);

    -- Question 3: File Extensions
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which file extension is commonly associated with a compressed archive?', '.zip is a standard file format for lossless data compression and archiving.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.txt', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.exe', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.zip', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.pdf', false);

    -- Question 4: Software Licensing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which software license allows anyone to view, modify, and distribute the source code?', 'Open Source licenses (like GPL, MIT) enable free access to source code.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Proprietary', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Shareware', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Open Source', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Freeware', false);

    -- Question 5: Application Delivery Not-Locally
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Streaming services like Netflix are an example of which application delivery method?', 'They are Cloud-based / SaaS streaming applications.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Local Installation', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Cloud-Hosted / Streaming', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Peer-to-Peer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Offline Only', false);

    -- Question 6: Business Software
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of software is primarily used for creating and managing spreadsheets?', 'Spreadsheet software (like Excel) is for data calculation and organization.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Word Processor', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Database Management', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spreadsheet', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Presentation', false);

    -- Question 7: Browser Features
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which browser feature prevents websites from tracking your browsing history locally (on the device)?', 'Private Browsing (or Incognito) mode prevents saving history/cookies locally.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Bookmarks', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Extensions', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Private / Incognito Mode', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Cache', false);

    -- Question 8: Collaboration Software
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Microsoft Teams and Slack are examples of what category of software?', 'They are Collaboration / Communication platforms.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Graphic Design', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Collaboration / Conferencing', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Antivirus', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'IDE', false);

    -- Question 9: OS Updates
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Why is it important to install Operating System updates?', 'Updates often contain patches for security vulnerabilities.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To make the internet faster', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To fix security vulnerabilities', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To use more hard drive space', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To delete old files', false);

    -- Question 10: File Management
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which structure does an OS use to organize files?', 'Files are organized in a hierarchical system of folders/directories.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Queue', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Stack', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Folder / Directory Hierarchy', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Linear List', false);

    -- Question 11: Application Architecture
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'An application that has 3 tiers usually consists of: Presentation, Logic/Application, and:', 'Data (or Database) tier is the third standard tier.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Network', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hardware', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data / Database', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Security', false);

    -- Question 12: Productivity Software
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which application is best suited for creating a digital slide show?', 'Presentation software (like PowerPoint or Keynote) is designed for this.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spreadsheet', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Word Processor', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Presentation Software', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DBMS', false);

    -- Question 13: Web Browsers
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a "cookie" in web browsing?', 'A small text file stored on the user''s device by a website to remember preferences or session status.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A virus', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A small text file for tracking/preferences', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A browser extension', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A graphic image', false);

    -- Question 14: Software Installation
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the purpose of an "EULA" presented during installation?', 'End User License Agreement (EULA) outlines the legal terms of use.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To check for viruses', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To configure settings', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To define legal terms of use', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To register the product online', false);

    -- Question 15: Utility Software
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which tool protects a computer from malicious software like viruses and worms?', 'Antimalware or Antivirus software protects against threats.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Firewall', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Antimalware / Antivirus', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Defragmenter', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Task Manager', false);

    -- Question 16: File Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which file extension generally denotes a portable document format intended to look the same on any device?', 'PDF (Portable Document Format) is the standard for fixed-layout documents.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.docx', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.html', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.pdf', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.jpg', false);

    -- Question 17: OS Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In Windows, which utility shows currently running processes and performance usage?', 'Task Manager displays active processes and resource usage.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Control Panel', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Device Manager', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Task Manager', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Disk Management', false);

    -- Question 18: Licensing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which licensing model charges a recurring fee (monthly/yearly) to use the software?', 'Subscription-based licensing requires recurring payments (SaaS typically uses this model).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Perpetual', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Subscription', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Freeware', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Site License', false);

    -- Question 19: Browser Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does the "S" in HTTPS stand for?', 'The S stands for Secure (meaning encrypted).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Standard', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Speed', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Secure', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'System', false);

    -- Question 20: Application Delivery
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Locally installed software runs on the:', 'It runs on the local device''s hardware (CPU/RAM).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Web server', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Cloud provider', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Client / Local Device', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ISP', false);

    -- Question 21: File Formats
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of these is a common audio file format?', '.mp3 is a widely used compressed audio format.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.png', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.mp3', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.avi', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.html', false);

    -- Question 22: OS Interfaces
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which interface type primarily uses text commands entered into a terminal?', 'CLI (Command Line Interface) relies on text input.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'GUI', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Touchscreen', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CLI', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'VR', false);

    -- Question 23: Business Software
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'CRM software is used primarily for managing:', 'CRM stands for Customer Relationship Management.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Computer Resources', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Customer Relationships', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Content Rendering', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Central Routing', false);

    -- Question 24: Web Browsers
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Clearing your browser cache can often help fix what issue?', 'Cache stores temporary files; if they are corrupted or outdated, pages may not load correctly.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'No internet connection', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Loading errors / Old version of a page', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Forgot password', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Virus infection', false);

    -- Question 25: Licensing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Shareware is typically software that:', 'Shareware allows a trial period before payment is required.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Is always free', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Is free for a trial period, then requires payment', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Is open source', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Is owned by the government', false);

    -- Question 26: Application Issues
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'If an application freezes and becomes unresponsive, what is the best first step to resolve it without rebooting?', 'Force closing the specific application (e.g., via Task Manager) is the standard resolution.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Reinstall the OS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Force quit the application (Task Manager)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Buy more RAM', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Unplug the computer', false);

    -- Question 27: Web Technologies
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which browser add-on blocks unwanted advertisements?', 'An Ad Blocker is a specific type of extension.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'VPN', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ad Blocker', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Cookie', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Firewall', false);

    -- Question 28: OS File Systems
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which file attribute can be set to prevent accidental editing of a file?', 'The "Read-only" attribute prevents modification.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hidden', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Archive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Read-only', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'System', false);

    -- Question 29: Business Software
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which software is designed to manage projects, schedules, and resources?', 'Project Management software facilitates these tasks.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Database software', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Project Management software', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Graphic Design software', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Web browser', false);

    -- Question 30: Drivers
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a device driver?', 'A driver is software that allows the OS to communicate with specific hardware.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A hardware tool', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Software enabling OS-hardware communication', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A type of virus', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The person operating the computer', false);

    -- Question 31: Application Architecture
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In a client-server application model, the web browser acts as the:', 'The browser is the Client, requesting resources from the Server.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Server', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Client', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Network', false);

    -- Question 32: Software Development
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term describes software that is distributed for free but requires a fee for advanced features (Freemium)?', 'Freemium software offers basic functionality for free, charging for premium features.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Shareware', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Open Source', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Freemium', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Public Domain', false);

    -- Question 33: OS Functions
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which OS component handles the scheduling of tasks and management of the CPU?', 'The Kernel (specifically the Scheduler) manages CPU time and processes.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Shell', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Kernel', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'GUI', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'BIOS', false);

    -- Question 34: Web Browsers
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Pop-up blockers in a web browser are primarily designed to:', 'Prevent unwanted advertising windows or malicious pop-ups from opening.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Speed up downloads', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Stop intrusive ads and windows', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encrypt passwords', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Manage bookmarks', false);

    -- Question 35: File Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which file extension implies an executable program in Windows?', '.exe is the standard executable extension.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.txt', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.exe', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.jpg', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.zip', false);

    -- Question 36: Productivity Software
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Database software (like Microsoft Access) is used to:', 'Store, organize, and retrieve structured data.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Edit photos', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Browse the web', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Store and manage structured data', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Write letters', false);

    -- Question 37: Cloud Computing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'SaaS stands for:', 'Software as a Service.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Software as a Service', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Storage as a Service', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'System as a Service', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Security as a Service', false);

    -- Question 38: Software Issues
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which action is commonly recommended if a single application is behaving erratically?', 'Uninstalling and reinstalling the application often fixes corrupted files or settings.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Format the hard drive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Uninstall and Reinstall the application', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Buy a new computer', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Replace the CPU', false);

    -- Question 39: OS Versions
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, '32-bit vs. 64-bit primarily refers to the computer''s ability to handle:', 'It refers to the width of the CPU registers, directly impacting the amount of RAM it can address.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Internet speed', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Memory (RAM) addressing', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Screen resolution', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hard drive size', false);

    -- Question 40: Business Software
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which software is essential for an accounting department to manage finances?', 'Accounting / Financial software (like QuickBooks).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CAD Software', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Accounting Software', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Video Editing Software', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Games', false);

    -- Question 41: Browsers
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the function of a "Proxy Server" in web browsing contexts?', 'It acts as an intermediary for requests from clients seeking resources from other servers, often for filtering or privacy.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To speed up the CPU', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To act as an intermediary / filter traffic', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To create graphics', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To play audio', false);

    -- Question 42: Licensing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Site License" typically allows:', 'Installation on multiple computers at a specific location or organization.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Use by a single person only', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Installation on an unlimited number of computers at a site', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Free distribution to the world', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Modification of source code', false);

    -- Question 43: File Formats
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which image format supports transparency?', '.png (and .gif) supports transparency.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.jpg', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.png', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.bmp', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.txt', false);

    -- Question 44: OS Features
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which feature allows you to copy text from one application and paste it into another?', 'The Clipboard is the temporary storage area for copy/paste operations.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Recycle Bin', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Clipboard', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Desktop', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Registry', false);

    -- Question 45: Application Delivery
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'An application repository (like the App Store or Google Play) provides a centralized way to:', 'Distribute, install, and update software safely.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Write code', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Download and install vetted applications', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Host websites', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Repair hardware', false);

    -- Question 46: Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Multifactor Authentication (MFA) requires:', 'Two or more forms of verification (Something you know, have, are).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A very long password', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Two or more different methods of verification', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Admin approval', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A fingerprint only', false);

    -- Question 47: Collaboration
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Screen sharing is a common feature of:', 'Conferencing / Collaboration software.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Word Processors', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Conferencing Software', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Music Players', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Antivirus', false);

    -- Question 48: OS Type
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Linux is an example of which type of Operating System?', 'Linux is the most famous Open Source OS.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Proprietary', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Open Source', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Paid-only', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Closed source', false);

    -- Question 49: Application Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'When software is "End of Life" (EOL), it means:', 'The vendor no longer supports it with updates or patches, making it a security risk.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It is brand new', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It is no longer supported/updated by the developer', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It is free', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It works perfectly forever', false);

    -- Question 50: Utilities
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which utility compresses files to reduce their size?', 'File Compression / Archiving software (like WinZip, 7-Zip).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encryption', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compression', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Defragmentation', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Formatting', false);

    -- Question 51: Browser
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In a URL like "http://www.example.com", what is "http"?', 'HTTP is the Protocol.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Domain', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Protocol', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'TLD', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Path', false);

    -- Question 52: Software Types
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of software is designed to harm your computer?', 'Malware (Malicious Software).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Firmware', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Malware', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Middlewar', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Shareware', false);

    -- Question 53: App Architecture
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which part of an application does the user interact with directly?', 'The UI (User Interface) or Presentation Layer.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Backend', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'User Interface (UI)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'API', false);

    -- Question 54: Licensing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which organization is known for Creative Commons licenses?', 'Creative Commons is a non-profit organization offering free copyright licenses.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Microsoft', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Creative Commons', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Adobe', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Apple', false);

    -- Question 55: Files
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Moving a file from one folder to another on the same drive typically does what?', 'It updates the file table entry; permission changes depend on the OS, but generally, it moves the pointer.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Creates a copy', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Moves the file pointer (fast)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compresses it', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encrypts it', false);

    -- Question 56: OS
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which OS is developed by Apple for their computers?', 'macOS.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Windows', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Linux', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'macOS', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Android', false);

    -- Question 57: Web
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which technology allows you to view a webpage that was previously visited without an internet connection (if cached)?', 'The Browser Cache stores local copies of pages.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DNS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Browser Cache', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Firewall', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'VPN', false);

    -- Question 58: Applications
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of application helps you write a resume or a report?', 'Word Processing software.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spreadsheet', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Word Processor', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Presentation', false);

    -- Question 59: Drivers
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'If a new printer is connected but not printing, what is the most likely software cause?', 'Missing or corrupt drivers are a common cause of hardware failure.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Monitor is off', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Missing / Corrupt Driver', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Internet is down', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Mouse is unplugged', false);

    -- Question 60: File Formats
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which extension is a plain text file?', '.txt')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.rtf', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.doc', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.txt', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.pdf', false);

    -- Question 61: Web Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which is a common symptom of a computer infected with malware?', 'Unexpected pop-ups, slow performance, and disabled security software.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Excessive available memory', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Unexpected pop-ups / Sluggishness', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Faster internet speeds', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Clearer screen resolution', false);

    -- Question 62: Software Installation
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Before installing new software, it is best practice to check:', 'System Requirements (minimum RAM, OS version, disk space).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The time of day', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'System Requirements', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The weather', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Printer ink levels', false);

    -- Question 63: OS
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Chrome OS is primarily designed to rely on:', 'Cloud-based applications and storage.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Heavy local processing', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Cloud-based apps/storage', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CD-ROMs', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Tape drives', false);

    -- Question 64: Productivity
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Spreadsheets are organized into:', 'Rows and Columns.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Paragraphs and Sentences', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Rows and Columns', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Slides and Decks', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Tracks and Sectors', false);

    -- Question 65: Licensing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of license is generally for a single specific user or device?', 'Single-use / Personal license.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Volume License', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Single-use License', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Enterprise License', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Public Domain', false);

    -- Question 66: Browser Features
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a "Bookmark" in a web browser?', 'A saved shortcut to a specific webpage URL.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A password', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A saved link to a website', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A history log', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A cookie', false);

    -- Question 67: File Management
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which shortcut key combination is universally used for "Undo"?', 'Ctrl+Z (or Command+Z) is the standard Undo shortcut.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ctrl+C', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ctrl+V', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ctrl+Z', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ctrl+X', false);

    -- Question 68: Application Delivery
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which represents a disadvantage of locally installed software?', 'It takes up local storage space and requires manual updates (usually).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Requires internet to run', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Takes up local storage space', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Cannot be used offline', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Slower performance', false);

    -- Question 69: Web Technology
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'HTML stands for:', 'HyperText Markup Language.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'High Tech Machine Language', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HyperText Markup Language', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Home Tool Markup Logic', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hyper Transfer Main Link', false);

    -- Question 70: OS Management
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does disk "Defragmentation" do?', 'It organizes file fragments on a hard drive to be contiguous, improving read speed.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Deletes files', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Reorganizes file parts to be contiguous', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encrypts data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Cleans the screen', false);

    -- Question 71: Software
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term describes software that is still in development but released for testing?', 'Beta software is pre-release software for testing.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Alpha', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Beta', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Gold', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Legacy', false);

    -- Question 72: Formats
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which file format is designed for high-resolution video?', '.mp4 (or .mkv, .mov) is a standard video container.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.mp3', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.jpg', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.mp4', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.gif', false);

    -- Question 73: Browsers
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Certificate errors in a browser usually indicate a problem with:', 'SSL/TLS certificates, meaning the connection might not be secure or the site identity is unverified.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The monitor', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SSL/security encryption', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The mouse', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The sound card', false);

    -- Question 74: Productivity
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which function in a spreadsheet automatically adds up a column of numbers?', 'SUM function.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'AVERAGE', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'COUNT', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SUM', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'IF', false);

    -- Question 75: OS
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In Windows, what is the "Registry"?', 'It is a hierarchical database storing configuration settings for the OS and applications.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A list of files', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A database of configuration settings', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The user manual', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The login screen', false);

    -- Question 76: Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which "Lock" generally refers to securing a physical laptop to a desk?', 'A Kensington Lock is a physical security device.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Caps Lock', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Kensington Lock / Cable Lock', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Num Lock', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Scroll Lock', false);

    -- Question 77: App Type
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which software category includes Adobe Photoshop and GIMP?', 'Graphic Design / Image Editing software.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Word Processing', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Graphic Design', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spreadsheet', false);

    -- Question 78: Cloud
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'If you use Microsoft 365 or Google Workspace, you are primarily using:', 'SaaS (Software as a Service) productivity suites.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'IaaS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SaaS', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PaaS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Private Cloud', false);

    -- Question 79: Collaboration
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which is a key benefit of cloud-based collaboration tools (like Google Docs)?', 'Real-time simultaneous editing by multiple users.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Works only offline', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Simultaneous real-time editing', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Requires no internet', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Higher cost', false);

    -- Question 80: OS Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Virtualization"?', 'Running multiple virtual instances of operating systems on a single physical machine.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Playing video games', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Running virtual machines on physical hardware', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Connecting to the internet', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using VR headsets', false);

    -- Question 81: Files
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A generic file name like "Document1" is generally poor practice because:', 'It is not descriptive, making organization and retrieval difficult.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It is too short', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It makes retrieval difficult due to lack of description', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It uses too many bytes', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Computers cannot read numbers', false);

    -- Question 82: Browsing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does clear "Browsing History" do?', 'Removes the list of websites you have visited from the browser''s log.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Deletes your account', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Removes the list of visited sites', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Uninstalls the browser', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Resets the internet connection', false);

    -- Question 83: Software
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Usually, where default installed programs are located in Windows?', 'Normally in the "Program Files" or "Program Files (x86)" directories.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'My Documents', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'C:\Windows', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Program Files', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'System32', false);

    -- Question 84: App Delivery
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which is an advantage of a "Portable Application"?', 'It does not require installation and can run from a removable drive (like a USB stick).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Runs faster', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'No installation required / Runs from USB', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Most secure', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Always free', false);

    -- Question 85: OS
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which OS is optimized for mobile devices with touchscreens (by Google)?', 'Android.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'iOS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Android', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Windows Server', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Unix', false);

    -- Question 86: Files
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Backing up data basically implies:', 'Creating a copy of the data in a separate location.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Deleting old data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Creating a redundant copy', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compressing data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Printing data', false);

    -- Question 87: Productivity
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'In a database, a "Query" is used to:', 'Ask a question or retrieve specific data from the database.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Delete the database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Retrieve specific data', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Format the text', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Save the file', false);

    -- Question 88: Cloud
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which is a potential drawback of relying entirely on Cloud Applications?', 'Loss of access during internet outages.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Too much hard drive usage', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Dependence on Internet Connectivity', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Cannot be updated', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Difficult to share', false);

    -- Question 89: Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which password policy helps prevent brute-force attacks?', 'Account Lockout thresholds (e.g., lock after 3 failed attempts).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Password expiration', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Account Lockout', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Reuse of passwords', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Short passwords', false);

    -- Question 90: Browser
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the "Home Page" in a browser?', 'The first page that loads when the browser is opened.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The last page visited', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The default startup page', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The bookmarks bar', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The search engine', false);

    -- Question 91: Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the main purpose of "Patch Management"?', 'To keep software updated with the latest security fixes and features.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To enhance graphics', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To fix holes in clothes', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To keep systems secure/updated', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To manage network cables', false);

    -- Question 92: Networking Apps
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which application is used to remotely access another computer''s desktop interface?', 'Remote Desktop software (like RDP, TeamViewer).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'FTP Client', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Remote Desktop', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Web Server', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Database Client', false);

    -- Question 93: Business
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of software is best for creating vector graphics (logos, scalable art)?', 'Vector Graphic software (like Adobe Illustrator).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Raster Editor', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Vector Graphics Editor', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Video Editor', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Audio Editor', false);

    -- Question 94: OS
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which file system is native to macOS?', 'APFS (Apple File System) is the modern default.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'NTFS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'FAT32', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'APFS', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'ZFS', false);

    -- Question 95: Licensing
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which organization manages the copyright of a "Public Domain" software?', 'No one. Public Domain means copyright has expired or been waived.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The Government', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The Author', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'No one / It is free for all', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Microsoft', false);

    -- Question 96: Browsers
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Enabling "Autofill" in a browser primarily helps to:', 'Automatically fill in forms (address, name, etc.) to save time.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Block viruses', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Fill in forms automatically', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Speed up video buffering', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Translate languages', false);

    -- Question 97: Application Issues
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'If an application fails to install, what is a common first troubleshooting step?', 'Run the installer as Administrator (elevated privileges).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Delete the hard drive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Run as Administrator', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Buy a new license', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Change the monitor resolution', false);

    -- Question 98: File Compression
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which file extension indicates a compressed tape archive (common in Linux)?', '.tar (often .tar.gz).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.iso', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.tar', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.exe', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, '.dll', false);

    -- Question 99: Cloud
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which service allows you to run a virtual desktop from the cloud?', 'DaaS (Desktop as a Service) / VDI.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DaaS', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SaaS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'MaaS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'LaaS', false);

    -- Question 100: Software
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of update mainly adds new features rather than just fixing bugs?', 'A version upgrade or Feature Update.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hotfix', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Security Patch', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Feature Update / Upgrade', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Driver rollback', false);

END $$;
