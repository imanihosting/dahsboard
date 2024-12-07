const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticateToken } = require('../middleware/auth');
const pool = require('../database/db');

router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { priceId } = req.body;
    const userId = req.user.id;

    const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${clientURL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientURL}/subscription/plans`,
      client_reference_id: userId,
      metadata: {
        userId: userId
      }
    });

    console.log('Stripe session created:', {
      sessionId: session.id,
      url: session.url,
      priceId: priceId
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
});

router.post('/verify-session', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    // Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Stripe session:', session);

    if (session.payment_status === 'paid') {
      try {
        // Start transaction
        await client.query('BEGIN');

        // Update user's subscription status
        const updateUserResult = await client.query(
          `UPDATE users 
           SET subscription_status = $1, 
               subscription_id = $2,
               subscription_end_date = NOW() + INTERVAL '1 month'
           WHERE id = $3
           RETURNING id`,
          ['active', session.subscription, userId]
        );

        if (updateUserResult.rows.length === 0) {
          throw new Error('User not found');
        }

        // Create or update user profile
        await client.query(
          `INSERT INTO user_profiles (user_id)
           VALUES ($1)
           ON CONFLICT (user_id) 
           DO UPDATE SET updated_at = CURRENT_TIMESTAMP
           RETURNING id`,
          [userId]
        );

        // Commit transaction
        await client.query('COMMIT');

        res.json({ 
          success: true,
          message: 'Subscription activated successfully'
        });
      } catch (dbError) {
        await client.query('ROLLBACK');
        console.error('Database error:', dbError);
        res.status(500).json({ 
          message: 'Database update failed',
          error: dbError.message
        });
      }
    } else {
      res.status(400).json({ 
        message: 'Payment incomplete',
        status: session.payment_status
      });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Verification error:', error);
    res.status(500).json({ 
      message: 'Verification failed',
      error: error.message
    });
  } finally {
    client.release();
  }
});

module.exports = router; 