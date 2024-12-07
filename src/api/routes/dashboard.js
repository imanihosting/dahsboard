const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

router.get('/data', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching dashboard data for user:', req.user.id);

    // Get user profile data
    const userQuery = await db.query(
      `SELECT users.first_name, users.last_name, users.email, users.phone,
              user_profiles.address, user_profiles.city, user_profiles.country, user_profiles.postal_code
       FROM users 
       LEFT JOIN user_profiles ON users.id = user_profiles.user_id
       WHERE users.id = $1`,
      [req.user.id]
    );

    // Get bookings
    const bookingsQuery = await db.query(
      `SELECT id, date, time, status, notes 
       FROM bookings 
       WHERE user_id = $1 
       ORDER BY date DESC, time DESC`,
      [req.user.id]
    );

    // Get messages
    const messagesQuery = await db.query(
      `SELECT m.*, 
              u.first_name as sender_name,
              u.last_name as sender_lastname
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE recipient_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    // Get emergency contacts
    const emergencyContactsQuery = await db.query(
      `SELECT * FROM emergency_contacts 
       WHERE user_id = $1 
       ORDER BY is_primary DESC`,
      [req.user.id]
    );

    const userData = userQuery.rows[0] || {};
    
    const dashboardData = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      country: userData.country,
      postal_code: userData.postal_code,
      bookings: bookingsQuery.rows || [],
      messages: messagesQuery.rows || [],
      emergency_contacts: emergencyContactsQuery.rows || []
    };

    console.log('Sending dashboard data:', dashboardData);
    res.json({ success: true, data: dashboardData });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch dashboard data',
      details: error.message
    });
  }
});

module.exports = router;