const pool = require('../db');

async function addSubscriptionColumns() {
  try {
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'inactive',
      ADD COLUMN IF NOT EXISTS subscription_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP;
    `);
    console.log('Successfully added subscription columns to users table');
  } catch (error) {
    console.error('Error adding subscription columns:', error);
  }
}

module.exports = addSubscriptionColumns; 