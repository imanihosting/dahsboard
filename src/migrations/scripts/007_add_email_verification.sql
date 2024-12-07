ALTER TABLE users
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN email_verification_token VARCHAR(255) UNIQUE,
ADD COLUMN email_verification_expires_at TIMESTAMP;

CREATE INDEX idx_users_email_verification ON users(email_verification_token); 