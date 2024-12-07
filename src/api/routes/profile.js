const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

router.post('/setup', authenticateToken, async (req, res) => {
  try {
    console.log('Profile setup request received:', req.body);
    console.log('User from token:', req.user);

    const { address_line1, address_line2, city, county, eircode, user_type } = req.body;
    
    // First verify the user exists in the database
    const userCheck = await db.query(
      'SELECT id FROM users WHERE id = $1',
      [req.user.id]
    );

    if (!userCheck.rows.length) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found in database'
      });
    }

    // Combine address lines into a single address field
    const fullAddress = address_line2 
      ? `${address_line1}, ${address_line2}`
      : address_line1;

    const result = await db.query(
      `INSERT INTO user_profiles 
       (user_id, address, city, country, postal_code) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [req.user.id, fullAddress, city, county, eircode]
    );

    res.json({ success: true, profile: result.rows[0] });
  } catch (error) {
    console.error('Profile setup error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.detail || 'Please check server logs for more information',
      userId: req.user?.id
    });
  }
});

module.exports = router;