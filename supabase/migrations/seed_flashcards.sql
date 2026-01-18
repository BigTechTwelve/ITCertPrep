-- Seed Flashcards for CompTIA Tech+
-- Automatically selects the first user found in auth.users to avoid UUID errors.

INSERT INTO flashcards (user_id, front, back)
SELECT 
  users.id,
  data.front,
  data.back
FROM 
  (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1) as users,
  (VALUES 
    ('Port Number: HTTP', '80'),
    ('Port Number: HTTPS', '443'),
    ('Port Number: SSH', '22'),
    ('Port Number: DNS', '53'),
    ('Port Number: FTP (Control)', '21'),
    ('Port Number: FTP (Data)', '20'),
    ('Port Number: RDP', '3389'),
    ('Port Number: POP3', '110'),
    ('Port Number: IMAP', '143'),
    ('Port Number: SMTP', '25'),
    ('WiFi 4 Standard Name', '802.11n'),
    ('WiFi 5 Standard Name', '802.11ac'),
    ('WiFi 6 Standard Name', '802.11ax'),
    ('Frequency for 802.11g', '2.4 GHz'),
    ('Frequency for 802.11a', '5 GHz'),
    ('RAID 0', 'Striping (Performance, No Redundancy)'),
    ('RAID 1', 'Mirroring (Redundancy, No Performance Gain)'),
    ('RAID 5', 'Striping with Parity (Requires 3+ disks)'),
    ('NVMe', 'Non-Volatile Memory Express (Protocol for SSDs over PCIe)'),
    ('SSD Form Factor (Laptop/Desktop)', 'M.2'),
    ('CPU', 'Central Processing Unit (The Brain)'),
    ('RAM', 'Random Access Memory (Volatile Storage)'),
    ('PSU', 'Power Supply Unit'),
    ('GPU', 'Graphics Processing Unit'),
    ('TPM', 'Trusted Platform Module (Security Chip for BitLocker/Win11)'),
    ('First step of Troubleshooting Theory', 'Identify the Problem'),
    ('Last step of Troubleshooting Theory', 'Document Findings, Actions, and Outcomes'),
    ('Command to release IP address', 'ipconfig /release'),
    ('Command to check connectivity', 'ping'),
    ('Command to show route to host', 'tracert (Windows) or traceroute (Linux)')
  ) as data(front, back);
