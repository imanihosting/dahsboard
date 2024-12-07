const db = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

async function runMigrations() {
  try {
    // Create migrations table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get all migration files
    const migrationFiles = await fs.readdir(path.join(__dirname, 'scripts'));
    const executedMigrations = await db.query('SELECT name FROM migrations');
    const executedMigrationNames = executedMigrations.rows.map(row => row.name);

    // Run pending migrations
    for (const file of migrationFiles) {
      if (!executedMigrationNames.includes(file)) {
        const migration = require(path.join(__dirname, 'scripts', file));
        await db.query('BEGIN');
        try {
          await migration.up();
          await db.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
          await db.query('COMMIT');
          console.log(`Migration ${file} executed successfully`);
        } catch (error) {
          await db.query('ROLLBACK');
          console.error(`Migration ${file} failed:`, error);
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Migration process failed:', error);
    process.exit(1);
  }
}

module.exports = { runMigrations }; 