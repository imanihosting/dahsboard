const db = require('../config/database');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  try {
    await db.query('BEGIN');

    // Seed users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      ['admin@example.com', hashedPassword, 'admin'],
      ['parent@example.com', hashedPassword, 'parent'],
      ['childminder@example.com', hashedPassword, 'childminder']
    ];

    for (const [email, password, role] of users) {
      await db.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
        [email, password, role]
      );
    }

    // Seed parent profiles
    await db.query(`
      INSERT INTO parent_profiles (user_id, name, contact_number, address)
      SELECT id, 'Test Parent', '+44123456789', '123 Test St, London'
      FROM users WHERE role = 'parent'
      ON CONFLICT DO NOTHING
    `);

    // Seed childminder profiles
    await db.query(`
      INSERT INTO childminder_profiles (user_id, name, contact_number, availability, qualifications, employment_type)
      SELECT id, 'Test Childminder', '+44987654321', 
        '{"monday": {"start": "09:00", "end": "17:00"}}',
        '["First Aid", "Child Care Level 3"]',
        'full-time'
      FROM users WHERE role = 'childminder'
      ON CONFLICT DO NOTHING
    `);

    await db.query('COMMIT');
    console.log('Database seeded successfully');
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Seeding failed:', error);
    throw error;
  }
}

module.exports = { seedDatabase }; 