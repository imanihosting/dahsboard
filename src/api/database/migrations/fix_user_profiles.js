const pool = require('../db');

async function fixUserProfiles() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Drop existing user_profiles table
    await client.query(`
      DROP TABLE IF EXISTS user_profiles CASCADE;
    `);

    // Recreate user_profiles table with proper constraint
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

    // Create trigger for updated_at
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
      CREATE TRIGGER update_user_profiles_updated_at
        BEFORE UPDATE ON user_profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query('COMMIT');
    console.log('Successfully fixed user_profiles table');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error fixing user_profiles table:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = fixUserProfiles; 