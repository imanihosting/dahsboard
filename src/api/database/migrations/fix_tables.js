const pool = require('../db');

async function fixTables() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Drop existing tables
    await client.query(`
      DROP TABLE IF EXISTS user_profiles CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    // Create users table with all required fields
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        user_type VARCHAR(20) NOT NULL,
        subscription_status VARCHAR(50) DEFAULT 'inactive',
        subscription_id VARCHAR(255),
        subscription_end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Successfully created users table');

    // Create user_profiles table
    await client.query(`
      CREATE TABLE user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        address TEXT,
        city VARCHAR(100),
        country VARCHAR(100),
        postal_code VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user
          FOREIGN KEY(user_id) 
          REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT unique_user_id
          UNIQUE(user_id)
      );
    `);
    console.log('Successfully created user_profiles table');

    // Create updated_at triggers
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      CREATE TRIGGER update_user_profiles_updated_at
        BEFORE UPDATE ON user_profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    // Insert a test user (optional)
    await client.query(`
      INSERT INTO users (
        first_name, 
        last_name, 
        email, 
        password, 
        user_type, 
        subscription_status
      ) VALUES (
        'Test',
        'User',
        'test@example.com',
        '$2b$10$YourHashedPasswordHere',  -- Replace with actual hashed password
        'parent',
        'active'
      ) ON CONFLICT (email) DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('Database migration completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in database migration:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = fixTables; 