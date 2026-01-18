-- Content: Questions 1-30 for Domain 6.0 Security
DO $$
DECLARE
    cert_id UUID;
    obj_id UUID;
    q_id UUID;
BEGIN
    -- Look up the certification ID
    SELECT id INTO cert_id FROM certifications WHERE title = 'CompTIA Tech+ (FC0-U71)' LIMIT 1;
    
    -- Look up the objective ID for Domain 6.0
    SELECT id INTO obj_id FROM objectives WHERE certification_id = cert_id AND title = '6.0 Security' LIMIT 1;

    -- If identifiers are not found, raise an exception
    IF cert_id IS NULL OR obj_id IS NULL THEN
        RAISE EXCEPTION 'Certification or Objective not found. Ensure 6.0 Security exists.';
    END IF;

    -- Question 1: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which core security principle ensures that data is not disclosed to unauthorized individuals?', 'Confidentiality.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integrity', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Availability', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Confidentiality', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Non-repudiation', false);

    -- Question 2: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does the "A" in the CIA Triad stand for?', 'Availability.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Authentication', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Authorization', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Availability', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Audit', false);

    -- Question 3: Attacks
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of attack involves tricking users into revealing sensitive information through deceptive emails?', 'Phishing.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DDoS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Phishing', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ransomware', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SQL Injection', false);

    -- Question 4: Authentication
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of the following is an example of Multi-Factor Authentication (MFA)?', 'Using a Password and a One-Time Code sent to your phone.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using two different passwords', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using a password and a PIN', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Password + One-Time Code (SMS/App)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Username and Email', false);

    -- Question 5: Malware
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of malware encrypts a user''s files and demands payment to unlock them?', 'Ransomware.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spyware', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Virus', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ransomware', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Adware', false);

    -- Question 6: Network Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the primary function of a Firewall?', 'To monitor and control incoming and outgoing network traffic based on security rules.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To speed up the internet', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To encrypt files', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To monitor and control network traffic', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To generating passwords', false);

    -- Question 7: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which principle implies giving users the minimum permissions necessary to do their job?', 'Least Privilege.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Separation of Duties', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Least Privilege', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Security through Obscurity', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Defense in Depth', false);

    -- Question 8: Encryption
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which protocol is used to secure web traffic (HTTPS)?', 'TLS (Transport Layer Security) or its predecessor SSL.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'FTP', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'TLS / SSL', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DNS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DHCP', false);

    -- Question 9: Social Engineering
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Tailgating is an example of which type of security threat?', 'Physical Social Engineering.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Digital Hacking', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Software Bug', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Physical / Social Engineering', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Network Sniffing', false);

    -- Question 10: Authentication
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which factor of authentication covers "Something you are"?', 'Biometrics (Fingerprint, Face ID, etc.).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Password', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Smart Card', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Biometrics', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PIN', false);

    -- Question 11: Attacks
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A DDoS attack aims to:', 'Overwhelm a system or network to make it unavailable to users.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Steal data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Overwhelm resources to deny service', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encrypt files', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Guess passwords', false);

    -- Question 12: Wireless
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which is the most secure modern wireless encryption standard?', 'WPA3.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'WEP', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'WPA', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'WPA2', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'WPA3', true);

    -- Question 13: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Ensuring that data has not been altered or tampered with involves which security concept?', 'Integrity.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Confidentiality', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integrity', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Availability', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Authorization', false);

    -- Question 14: Tools
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the purpose of a VPN (Virtual Private Network)?', 'To create a secure, encrypted connection over a public network (like the internet).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To remove viruses', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To boost wifi signal', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To create a secure, encrypted tunnel', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To store passwords', false);

    -- Question 15: Malware
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Software that secretly collects user information without their consent is called:', 'Spyware.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ransomware', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spyware', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Worm', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Logic Bomb', false);

    -- Question 16: Authentication
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which password policy helps prevent Brute-Force attacks?', 'Account Lockout policies (locking account after X failed attempts).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Password Expiration', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Password History', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Account Lockout', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Minimum Length', false);

    -- Question 17: Physical Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of the following is considered a Physical Security control?', 'A security guard or biometric door lock.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Firewall', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Antivirus', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Security Guard / Locks', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encryption', false);

    -- Question 18: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Non-Repudiation"?', 'Guaranteeing that a sender cannot deny having sent a message (often via digital signatures).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hiding data', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Guaranteeing sender identity / cannot deny action', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Restoring backups', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Preventing malware', false);

    -- Question 19: Privacy
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does PII stand for?', 'Personally Identifiable Information.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Public Internet Interface', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Private Internal IP', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Personally Identifiable Information', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Protected Integrity Info', false);

    -- Question 20: Updates
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Why is it important to keep software "Patched"?', 'To fix known security vulnerabilities.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To use more disk space', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To fix security vulnerabilities', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To make the UI look better', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To delete old files', false);

    -- Question 21: Attacks
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a "Zero-Day" vulnerability?', 'A software flaw that is unknown to the vendor and has no patch available.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A virus that lasts zero days', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A vulnerability unknown to the vendor / unpatched', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A very old bug', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A weak password', false);

    -- Question 22: Best Practices
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'When leaving your computer unattended, you should always:', 'Lock the screen (Win+L).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Turn off the monitor only', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Leave it logged in', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Lock the screen / Workstation', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Disconnect the internet', false);

    -- Question 23: Authentication
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'SSO stands for:', 'Single Sign-On.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Secure Socket Option', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Simple Security Output', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Single Sign-On', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'System Safety Officer', false);

    -- Question 24: Malware
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of malware appears to be legitimate software but performs malicious acts (like a wooden horse)?', 'Trojan Horse.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Worm', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Trojan Horse', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Virus', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spyware', false);

    -- Question 25: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the practice of disguising the sender address of an email to mislead the recipient?', 'Spoofing.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Phishing', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spoofing', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Spamming', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Sniffing', false);

    -- Question 26: Wireless
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Rogue Access Point" is:', 'An unauthorized wireless access point installed on a network.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A broken router', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'An unauthorized AP', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A firewall rule', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A type of antivirus', false);

    -- Question 27: Web
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A digital certificate used for HTTPS is typically issued by a:', 'Certificate Authority (CA).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The Government', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Certificate Authority (CA)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The ISP', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The Computer Manufacturer', false);

    -- Question 28: Rights
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a common method for handling "Data at Rest" security?', 'Encryption (encrypting the hard drive/files).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Firewalls', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encryption', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Network Monitoring', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using multiple monitors', false);

    -- Question 29: Attacks
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Man-in-the-Middle" (MitM) attack involves:', 'Intercepting communication between two parties.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Deleting files', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Intercepting communications', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Blocking a server', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Guessing passwords', false);

    -- Question 30: Tools
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which software is designed to detect, prevent, and remove malware?', 'Antivirus / Anti-malware.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Firewall', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Antivirus', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'VPN', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Browser', false);

    -- Question 31: Physical Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which physical security measure helps prevent theft of laptops?', 'Cable Locks (Kensington locks).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Screen saver', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Cable Lock', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ad blocker', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Strong password', false);

    -- Question 32: Recovery
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which plan outlines how an organization will restore operations after a major disaster?', 'Disaster Recovery Plan (DRP).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'backup Schedule', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Disaster Recovery Plan', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Acceptable Use Policy', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SLA', false);

    -- Question 33: Authentication
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Biometrics" in security?', 'Authentication using physical characteristics (fingerprint, retina, face).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A long password', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Authentication via physical traits', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A smart card', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A security question', false);

    -- Question 34: Tools
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which tool scans a network to find open ports and vulnerabilities?', 'Network Scanner / Vulnerability Scanner.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Word Processor', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Network Scanner', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compiler', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Media Player', false);

    -- Question 35: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Availability" in the CIA Triad?', 'Ensuring information and resources are accessible when needed.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Keeping data secret', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ensuring data is accurate', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ensuring data is accessible', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Log analysis', false);

    -- Question 36: Attacks
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which attack tries every possible combination of characters to guess a password?', 'Brute-Force Attack.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Dictionary Attack', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Brute-Force Attack', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Phishing', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Injection', false);

    -- Question 37: Web Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Clearing browser cache/cookies is a good step to troubleshooting but also for:', 'Privacy (removing tracking data).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Improving internet speed only', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Privacy / Removing tracking data', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Stopping viruses', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Updating Windows', false);

    -- Question 38: Social Engineering
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Looking over someone''s shoulder to see their password is called:', 'Shoulder Surfing.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Tailgating', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Shoulder Surfing', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Dumpster Diving', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Phishing', false);

    -- Question 39: Authentication
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which of these is the strongest password?', 'Tr0ub4dor&3 (Mix of case, numbers, symbols, length).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'password123', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'admin', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'MyNameIsJohn', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Tr0ub4dor&3#', true);

    -- Question 40: Controls
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is an "AUP" (Acceptable Use Policy)?', 'A document stipulating constraints and practices that a user must agree to for access to a corporate network.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A software update', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Acceptable Use Policy', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Antivirus Update Protocol', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Automatic User Provisioning', false);

    -- Question 41: Malware
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Worm" is a type of malware that:', 'Self-replicates and spreads across networks without human interaction.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Requires a host file', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Self-replicates / Spreads automatically', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Locks files for ransom', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Displays ads', false);

    -- Question 42: Encryption
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Symmetric encryption uses:', 'The same key for both encryption and decryption.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Two different keys', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The same key', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'No keys', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A public and private key', false);

    -- Question 43: Security Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'The principle of "Defense in Depth" means:', 'Using multiple layers of security controls to protect assets.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using only a firewall', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using multiple layers of security', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Digging a moat', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using only antivirus', false);

    -- Question 44: Authentication
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which involves verifying the identity of a user?', 'Authentication.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Authorization', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Accounting', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Authentication', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encryption', false);

    -- Question 45: Web
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does a "Padlock" icon in the browser address bar indicate?', 'The connection to the website is encrypted (HTTPS).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The site is offline', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The connection is encrypted', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The site is blocked', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The browser is locked', false);

    -- Question 46: Access Control
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'RBAC stands for:', 'Role-Based Access Control.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Rule-Based Access Control', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Role-Based Access Control', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Real-Time Access Control', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Remote Base Access Control', false);

    -- Question 47: Attacks
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Keylogging"?', 'Recording every keystroke a user makes to steal passwords or data.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Unlocking a door', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Recording keystrokes', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Logging into a database', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encrypting a disk', false);

    -- Question 48: Social Engineering
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Searching through trash to find sensitive documents is called:', 'Dumpster Diving.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Recycling', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Dumpster Diving', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data Mining', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Trash Talk', false);

    -- Question 49: Mobile
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which feature allows you to erase a lost mobile device remotely?', 'Remote Wipe.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Remote Desktop', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Remote Wipe', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'GPS Tracking', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Airplane Mode', false);

    -- Question 50: Wireless
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Using an open, unsecured Wi-Fi hotspot risks:', 'Data interception / Sniffing.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Faster speeds', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data interception', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Getting a virus immediately', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Nothing', false);

    -- Question 51: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which law/regulation focuses on protecting EU citizens'' data privacy?', 'GDPR (General Data Protection Regulation).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HIPAA', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'GDPR', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PCI-DSS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SOX', false);

    -- Question 52: Authentication
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which is an example of "Something you have"?', 'A Smart Card or Hardware Token.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Password', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Fingerprint', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Smart Card / Token', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PIN', false);

    -- Question 53: Attacks
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Vishing is Phishing conducted over:', 'Voice (Telephone).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Email', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SMS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Voice / Telephone', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Video', false);

    -- Question 54: Tools
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which device is used to filter network traffic and block unauthorized access?', 'Firewall.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Switch', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hub', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Firewall', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Modem', false);

    -- Question 55: Malware
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Rootkit" is designed to:', 'Gain administrative access and hide its presence from the OS.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Show ads', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hide its presence / Gain root access', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Log keystrokes', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encrypt files', false);

    -- Question 56: Encryption
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Hashing is a one-way function used primarily for:', 'Verifying data integrity (e.g., file checksums, password storage).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encrypting data for transmission', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Verifying integrity', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Compressing videos', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Making backups', false);

    -- Question 57: Physical Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which control helps prevent unauthorized entry into a building?', 'Badge Readers / Access Cards.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Firewall', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Badge Reader', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Antivirus', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'VPN', false);

    -- Question 58: Data
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does "DLP" stand for in security?', 'Data Loss Prevention.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Digital Line Protocol', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data Loss Prevention', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Direct Link Protection', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Device Lock Protocol', false);

    -- Question 59: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Authorization happens:', 'After Authentication, determining what the user can do.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Before Authentication', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'After Authentication', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Instead of Authentication', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Only on Tuesdays', false);

    -- Question 60: Attacks
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is a "Botnet"?', 'A network of private computers infected with malicious software and controlled as a group.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A robot network for factories', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A network of infected computers', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A fast internet connection', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A social media site', false);

    -- Question 61: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which security concept is about proving a user is who they say they are?', 'Identification.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Authorization', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Accounting', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Identification', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integrity', false);

    -- Question 62: Controls
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Single-Factor Authentication"?', 'Using only one method (e.g., just a password) to log in.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using a password and a token', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using two passwords', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using only one method', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using no password', false);

    -- Question 63: Physical Security
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Mantrap" is:', 'A physical security control consisting of two doors where one closes before the other opens.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A malware trap', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A physical double-door entry system', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A honeypot', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A phishing email', false);

    -- Question 64: Attacks
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which attack exploits input vulnerabilities to manipulate a database?', 'SQL Injection.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Phishing', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SQL Injection', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DDoS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Buffer Overflow', false);

    -- Question 65: Mobile
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Using "Screen Locks" (PIN/Pattern) on mobile devices protects against:', 'Unauthorized physical access.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Remote hacking', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Unauthorized physical access', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Virus infection', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Data corruption', false);

    -- Question 66: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term describes the process of keeping track of what a user does (logging)?', 'Accounting.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Authentication', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Authorization', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Accounting', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Attacking', false);

    -- Question 67: Tools
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does an "Intrusion Detection System" (IDS) do?', 'Monitors network traffic for suspicious activity and issues alerts.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Blocks all traffic', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Monitors traffic and alerts', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Deletes viruses', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encrypts the drive', false);

    -- Question 68: Authentication
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Facial recognition is considered which type of authentication factor?', 'Something you are (Biometrics).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Something you know', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Something you have', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Something you are', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Something you do', false);

    -- Question 69: Web
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which protocol is the unsecure predecessor to HTTPS?', 'HTTP.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'FTP', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'HTTP', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SSH', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Telnet', false);

    -- Question 70: Social Engineering
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, '"Whaling" is a specific type of Phishing attack that targets:', 'High-level executives (CEOs, CFOs).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Common employees', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Whales', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'High-level executives', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Gamers', false);

    -- Question 71: Encryption
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Asymmetric encryption involves typically:', 'A Public Key for encryption and a Private Key for decryption.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'One key only', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'No keys', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Public and Private keys', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Three keys', false);

    -- Question 72: Attacks
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which type of attack involves an authorized user being tricked into performing an action they didn''t intend (e.g., clicking a link)?', 'Cross-Site Request Forgery (CSRF).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'XSS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'CSRF', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'SQL Injection', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'DDoS', false);

    -- Question 73: Physical
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Privacy Filter" (screen protector) is used to prevent:', 'Shoulder Surfing.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Glare', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Shoulder Surfing / Visual Hacking', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Scratches', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Fingerprints', false);

    -- Question 74: Tools
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which tool captures network packets for analysis (sniffing)?', 'Wireshark (Protein Analyzer).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Notepad', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Wireshark / Packet Sniffer', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Paint', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Calculator', false);

    -- Question 75: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which security concept ensures that a system is always up and running?', 'Availability.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Confidentiality', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Integrity', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Availability', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Authenticity', false);

    -- Question 76: Authentication
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which is an example of "Something you know"?', 'A Password or PIN.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Fingerprint', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Password / PIN', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Key Fob', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Retina Scan', false);

    -- Question 77: Malware
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Malware that is triggered by a specific event or time is called a:', 'Logic Bomb.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Virus', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Logic Bomb', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Worm', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Ransomware', false);

    -- Question 78: Wireless
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Hiding the SSID (Network Name) of a Wi-Fi router:', 'Does not provide real security, as it can still be discovered.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Makes the network impossible to hack', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Does not provide real security', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Speeds up the network', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Is illegal', false);

    -- Question 79: Controls
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which control restricts what software can run on a system?', 'Application Whitelisting.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Blacklisting', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Whitelisting', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Greylisting', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Firewalling', false);

    -- Question 80: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Risk" in cybersecurity?', 'The likelihood of a threat exploiting a vulnerability.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A certainty of attack', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Likelihood of threat exploiting vulnerability', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The cost of hardware', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The speed of the network', false);

    -- Question 81: Attacks
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Social Engineering"?', 'Manipulating people into performing actions or divulging confidential information.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Engineering safer buildings', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Manipulating people for data', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Coding social networks', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hardware hacking', false);

    -- Question 82: Authentication
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which technology generates a random code that changes every 30-60 seconds for MFA?', 'OTP (Time-based One-Time Password / TOTP).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Static Password', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'TOTP / Authenticator App', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Captcha', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Barcode', false);

    -- Question 83: Web
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'A "Cookie" is:', 'A small piece of data sent from a website and stored on the user''s computer.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A virus', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A small file stored by browser', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A password manager', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'An antivirus scanner', false);

    -- Question 84: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does the term "Backdoor" refer to?', 'A hidden method for bypassing normal authentication.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'The rear exit of the building', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A hidden bypass for authentication', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A backup tape', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A server rack', false);

    -- Question 85: Encryption
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What does "BitLocker" do in Windows?', 'Encrypts the entire drive to protect data at rest.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Defragments the drive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encrypts the drive', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Scans for viruses', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Cleans the registry', false);

    -- Question 86: Network
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'DMZ (Demilitarized Zone) is:', 'A subnetwork that exposes external-facing services to an untrusted network (internet).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A war zone', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A screen protector', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A network segment for public services', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'A password vault', false);

    -- Question 87: Updates
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Why should you avoid using "End-of-Life" (EOL) software?', 'It no longer receives security updates, making it vulnerable.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It is too expensive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It is too fast', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It receives no security patches', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It uses too much RAM', false);

    -- Question 88: Attacks
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Cross-Site Scripting" (XSS)?', 'Injecting malicious scripts into trusted websites.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Writing bad HTML', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Injecting malicious scripts', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Stealing a laptop', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Breaking a password', false);

    -- Question 89: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term describes a flaw or weakness in a system?', 'Vulnerability.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Threat', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Risk', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Vulnerability', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Exploit', false);

    -- Question 90: Mobile
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, '"Jailbreaking" (iOS) or "Rooting" (Android) involves:', 'Removing manufacturer restrictions to gain full control, which lowers security.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Installing antivirus', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Removing restrictions / Root access', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Updating the OS', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Encrypting the phone', false);

    -- Question 91: Controls
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which physical security device detects movement in a room?', 'Motion Sensor.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Smoke Detector', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Motion Sensor', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Heat Sensor', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Badge Reader', false);

    -- Question 92: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the "IoT" security risk?', 'Many IoT devices have weak default security and are easily hacked.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'They use too much power', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Weak default security / Easily hacked', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'They are too expensive', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'They break easily', false);

    -- Question 93: Attacks
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Bluejacking"?', 'Sending unsolicited messages to a device via Bluetooth.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Stealing data via Bluetooth', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Sending unsolicited messages via Bluetooth', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hacking a car', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Jamming wifi', false);

    -- Question 94: Authentication
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which is considered a strong password practice?', 'Changing passwords regularly and not reusing them.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Writing it on a post-it', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Sharing it with IT', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Changing regularly / No reuse', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using "password123"', false);

    -- Question 95: Tools
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is the purpose of "Patch Management" software?', 'To automatically deploy updates to software and OS across a network.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To fix clothes', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To deploy updates automatically', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To manage passwords', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'To write code', false);

    -- Question 96: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which term refers to legitimate software that is bundled with unwanted programs (adware/toolbars)?', 'PUP (Potentially Unwanted Program).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Virus', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'PUP (Potentially Unwanted Program)', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Rootkit', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Trojan', false);

    -- Question 97: Mobile
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "Sideloading" on a mobile device?', 'Installing an app from a source other than the official App Store.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Charging the phone', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Installing from unofficial source', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Transferring photos', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Using split screen', false);

    -- Question 98: Social Engineering
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'An attacker calls a user pretending to be IT support to get their password. This is:', 'Impersonation (Vishing/Social Engineering).')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Hacking', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Impersonation', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Keylogging', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Sniffing', false);

    -- Question 99: Wireless
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'What is "WPS" (Wi-Fi Protected Setup) often vulnerable to?', 'Brute-force attacks against its PIN.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'It makes wifi too fast', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Brute-force PIN attacks', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Nothing, it is perfect', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Interference', false);

    -- Question 100: Concepts
    INSERT INTO questions (objective_id, type, points, text, explanation)
    VALUES (obj_id, 'multiple_choice', 10, 'Which security mindset assumes that the network is already compromised?', 'Zero Trust.')
    RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Open Trust', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Zero Trust', true);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Full Trust', false);
    INSERT INTO answers (question_id, text, is_correct) VALUES (q_id, 'Blind Trust', false);

END $$;
