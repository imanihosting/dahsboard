const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const pool = require('../database/db');

router.get('/parent', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching dashboard data for user:', userId);

    // Fetch user data
    const userQuery = await pool.query(
      'SELECT first_name, last_name, email, phone FROM users WHERE id = $1',
      [userId]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch bookings (if the table exists)
    let bookings = [];
    try {
      const bookingsQuery = await pool.query(
        'SELECT * FROM bookings WHERE parent_id = $1 ORDER BY date DESC LIMIT 5',
        [userId]
      );
      bookings = bookingsQuery.rows;
    } catch (error) {
      console.log('Bookings table might not exist yet:', error.message);
    }

    // Fetch messages (if the table exists)
    let messages = [];
    try {
      const messagesQuery = await pool.query(
        'SELECT * FROM messages WHERE recipient_id = $1 ORDER BY created_at DESC LIMIT 5',
        [userId]
      );
      messages = messagesQuery.rows;
    } catch (error) {
      console.log('Messages table might not exist yet:', error.message);
    }

    // Fetch emergency contacts (if the table exists)
    let emergency_contacts = [];
    try {
      const contactsQuery = await pool.query(
        'SELECT * FROM emergency_contacts WHERE user_id = $1',
        [userId]
      );
      emergency_contacts = contactsQuery.rows;
    } catch (error) {
      console.log('Emergency contacts table might not exist yet:', error.message);
    }

    const userData = {
      ...userQuery.rows[0],
      bookings,
      messages,
      emergency_contacts
    };

    console.log('Sending dashboard data:', userData);
    res.json(userData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dashboard data',
      error: error.message 
    });
  }
});

module.exports = router; 