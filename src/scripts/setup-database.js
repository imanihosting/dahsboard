require('dotenv').config();
const { runMigrations } = require('../migrations');
const { seedDatabase } = require('../seeders');

async function setupDatabase() {
  try {
    console.log('Running migrations...');
    await runMigrations();
    
    console.log('Seeding database...');
    await seedDatabase();
    
    console.log('Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase(); 