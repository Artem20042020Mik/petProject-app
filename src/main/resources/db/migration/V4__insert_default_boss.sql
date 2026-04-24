INSERT INTO users (email, password, role)
SELECT 'boss@project.com', '$2a$10$tJS2w6piRxciS3QfGMcLju0gTfCA3alvLRWx2WhZ6RMOoIiEDUXLW', 'ROLE_BOSS'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'boss@project.com'
);