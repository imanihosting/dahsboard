const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { pool } = require('../config/db');

// Use raw body for Stripe webhook
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Update user's subscription status in database
        await pool.query(
          `INSERT INTO subscriptions (
            user_id,
            stripe_subscription_id,
            stripe_customer_id,
            plan_id,
            status,
            current_period_start,
            current_period_end
          ) VALUES ($1, $2, $3, $4, $5, to_timestamp($6), to_timestamp($7))`,
          [
            session.client_reference_id, // user_id we passed during checkout
            session.subscription,
            session.customer,
            session.metadata.plan_id,
            'active',
            session.subscription_data?.trial_start || (Date.now() / 1000),
            session.subscription_data?.trial_end || ((Date.now() / 1000) + 30 * 24 * 60 * 60) // 30 days from now
          ]
        );
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object;
        
        // Update subscription status
        await pool.query(
          `UPDATE subscriptions 
           SET status = $1, 
               current_period_end = to_timestamp($2)
           WHERE stripe_subscription_id = $3`,
          [
            subscription.status,
            subscription.current_period_end,
            subscription.id
          ]
        );
        break;

      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object;
        
        // Update subscription status to canceled
        await pool.query(
          `UPDATE subscriptions 
           SET status = 'canceled' 
           WHERE stripe_subscription_id = $1`,
          [canceledSubscription.id]
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).send('Webhook processing failed');
  }
});

module.exports = router; 