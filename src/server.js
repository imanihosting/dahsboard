require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('./api/database/db');
const path = require('path');
const addSubscriptionColumns = require('./api/database/migrations/add_subscription_columns');
const createTables = require('./api/database/migrations/create_tables');
const fixTables = require('./api/database/migrations/fix_tables');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(bodyParser.json());

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

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/stripe', webhookRoutes);
app.use('/api/dashboard', dashboardRoutes);

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
} else {
  // Development mode - let React dev server handle the frontend
  app.get('*', (req, res) => {
    res.json({ message: 'API server running' });
  });
}

// Run migrations
(async () => {
  try {
    await fixTables();
    console.log('Database setup completed');
  } catch (error) {
    console.error('Database setup error:', error);
  }
})();

const PORT = process.env.PORT || 5501;

// Start server with confirmation message
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Add this after your database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connection test successful:', res.rows[0]);
  }
});