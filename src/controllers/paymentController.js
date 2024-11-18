import Payment from '../schemas/Payment.js';

import logger from '../config/logger.js';

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

