const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

router.post('/register', async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      password, 
      user_type,
      childminder_profile // Additional fields for childminder
    } = req.body;
    
    console.log('Registration attempt:', { first_name, last_name, email, phone, user_type });

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (
          first_name,
          last_name,
          email,
          password_hash,
          phone,
          user_type,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, email, user_type`,
        [first_name, last_name, email, hashedPassword, phone, user_type]
      );

      // Insert into user_profiles
      await client.query(
        `INSERT INTO user_profiles (
          user_id,
          full_name,
          created_at,
          updated_at
        ) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [userResult.rows[0].id, `${first_name} ${last_name}`]
      );

      // Insert into role-specific profile
      if (user_type === 'parent') {
        await client.query(
          `INSERT INTO parent_profiles (
            user_id,
            created_at
          ) VALUES ($1, CURRENT_TIMESTAMP)`,
          [userResult.rows[0].id]
        );
      } else if (user_type === 'childminder') {
        await client.query(
          `INSERT INTO childminder_profiles (
            user_id,
            bio,
            hourly_rate,
            experience_years,
            dbs_check_status,
            available_from,
            available_to,
            max_children,
            address,
            created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)`,
          [
            userResult.rows[0].id,
            childminder_profile.bio,
            childminder_profile.hourly_rate,
            childminder_profile.experience_years,
            childminder_profile.dbs_check_status,
            childminder_profile.available_from,
            childminder_profile.available_to,
            childminder_profile.max_children,
            childminder_profile.address
          ]
        );
      }

      await client.query('COMMIT');

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: userResult.rows[0].id,
          email: userResult.rows[0].email,
          user_type: userResult.rows[0].user_type
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: userResult.rows[0].id,
          email: userResult.rows[0].email,
          first_name,
          last_name,
          user_type: userResult.rows[0].user_type
        }
      });

    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Database error during registration:', err);
      throw err;
    } finally {
      client.release();
    }

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      error: 'Server error during registration',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userResult = await pool.query(
      'SELECT id, email, password, first_name, user_type, subscription_status FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        user_type: user.user_type 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info and token
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        user_type: user.user_type,
        subscription_status: user.subscription_status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 