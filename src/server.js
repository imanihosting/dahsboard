require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { pool } = require('./api/config/db');
const path = require('path');
const addSubscriptionColumns = require('./api/database/migrations/add_subscription_columns');
const createTables = require('./api/database/migrations/create_tables');
const fixTables = require('./api/database/migrations/fix_tables');
const { runMigrations } = require('./api/db/migrations');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', process.env.CLIENT_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Import routes
const authRoutes = require('./api/routes/auth');
const stripeRoutes = require('./api/routes/stripe');
const subscriptionRoutes = require('./api/routes/subscription');
const webhookRoutes = require('./api/routes/webhook');
const dashboardRoutes = require('./api/routes/dashboard');
const profileRoutes = require('./api/routes/profile');  // Added profile routes

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/stripe', webhookRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);  // Added profile routes

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.json({ message: 'API server running' });
  });
}

const PORT = process.env.PORT || 5001;

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

const startServer = async () => {
  try {
    // Single database connection test
    const dbTest = await pool.query('SELECT NOW()');
    console.log('Database connected successfully at:', dbTest.rows[0].now);

    // Verify user_profiles table structure
    const tableCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_profiles'
      ORDER BY ordinal_position;
    `);
    console.log('user_profiles table structure:', tableCheck.rows);

    // Run migrations in sequence
    await runMigrations();
    await fixTables();
    console.log('Database setup completed');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Client URL: ${process.env.CLIENT_URL}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();