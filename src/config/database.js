const { Pool } = require('pg');
const retry = require('retry');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    this.connectWithRetry();
  }

  connectWithRetry() {
    const operation = retry.operation({
      retries: 5,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 60000,
    });

    operation.attempt(async (currentAttempt) => {
      try {
        await this.pool.connect();
        console.log('Successfully connected to PostgreSQL database');
      } catch (error) {
        console.error(`Database connection attempt ${currentAttempt} failed:`, error);
        if (operation.retry(error)) {
          return;
        }
      }
    });
  }

  async query(text, params) {
    try {
      const start = Date.now();
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }
}

module.exports = new Database(); 