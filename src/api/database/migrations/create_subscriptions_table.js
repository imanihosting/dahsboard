const { pool } = require('../../config/db');

async function createSubscriptionsTable() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create subscriptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        stripe_subscription_id VARCHAR(255) UNIQUE,
        stripe_customer_id VARCHAR(255),
        plan_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'inactive',
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create trigger for updated_at
    await client.query(`
      CREATE TRIGGER update_subscriptions_updated_at
        BEFORE UPDATE ON subscriptions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query('COMMIT');
    console.log('Successfully created subscriptions table');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating subscriptions table:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = createSubscriptionsTable;