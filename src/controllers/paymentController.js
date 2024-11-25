import Payment from '../schemas/Payment.js';
import logger from '../config/logger.js';
import dotenv from 'dotenv';
import Plan from '../schemas/Plan.js';
import Stripe from 'stripe';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (req, res) => {
  const { planId, clinicId } = req.body;

  if (!planId || !clinicId) {
    return res.status(400).send({ error: 'Plan ID and Clinic ID are required' });
  }

  try {
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).send({ error: 'Plan not found' });
    }

    if (typeof plan.price !== 'number') {
      return res.status(400).send({ error: 'Invalid plan price' });
    }

    // Crear la sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: plan.name,
              description: plan.features.join(', '),
            },
            unit_amount: Math.round(plan.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`, 
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.status(200).send({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error.message || error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};




export const registerPayment = async (req, res) => {
  try {
    const {date,clinicId,status,planId } = req.body;
    try {

      const payment = new Payment({
        date,
        clinicId,
        status,
        planId
      });

      await payment.save();
      logger.info(`Payment ${payment._id} created`);
      res.status(201).json(payment);

    } catch (error) {
      logger.error('Invalid credentials', {
        method: req.method,
        url: req.originalUrl,
        error: error
      });

      res.status(400).json({ message: error.message });
    }

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export const obtainAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    logger.error('Error fetching payments', {
      method: req.method,
      url: req.originalUrl,
      error: error
    });
    res.status(500).json({ message: error.message });
  }
}
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id); 


    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    logger.info(`Payment ${payment._id} retrieved`);
    res.status(200).json(payment);

  } catch (error) {
    logger.error('Error retrieving payment', {
      method: req.method,
      url: req.originalUrl,
      error: error
    });

    res.status(500).json({ message: 'An error occurred while retrieving the payment' });
  }
};

export const deletePayment = async (req, res) => {

  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) {
      logger.error('Payment not found', {
        method: req.method,
        url: req.originalUrl
      });
      res.status(404).json({ message: 'Payments not found' });
    } else {
      try {
        await payment.deleteOne();
        logger.info(`Payment ${payment._id} deleted from database`);
        res.status(204).json({ message: 'Payment deleted' });
      } catch (error) {
        logger.error('Error deleting payments', {
          method: req.method,
          url: req.originalUrl,
          error: error
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
