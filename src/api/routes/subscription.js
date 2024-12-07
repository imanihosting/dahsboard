const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authenticateToken = require('../middleware/auth');

router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { priceId } = req.body;
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/profile/setup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscription/plans`,
      client_reference_id: req.user.id,
      customer_email: req.user.email
    });

    res.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(400).json({ 
      error: {
        message: error.message
      }
    });
  }
});

module.exports = router;
