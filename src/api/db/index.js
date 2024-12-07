const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || '10.10.5.215',
  port: process.env.DB_PORT || '5432',
  database: process.env.DB_NAME || 'childminder_connect',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
});

pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 