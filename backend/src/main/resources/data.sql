-- Insert users if table is empty
INSERT INTO users (name, balance, email)
SELECT 'Alice', 500.00, 'alice@example.com'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Alice');

INSERT INTO users (name, balance, email)
SELECT 'Bob', 500.00, 'bob@example.com'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Bob');
