import Payment from '../schemas/Payment.js';
import logger from '../config/logger.js';

import CircuitBreaker from 'opossum';

const databaseOperation = async (operation) => {
  return await operation();
};

const breakerOptions = {
  timeout: 5000, // Tiempo máximo para completar una operación
  errorThresholdPercentage: 50, // Porcentaje de fallos para abrir el circuito
  resetTimeout: 10000, // Tiempo antes de intentar Half-Open
};

const circuitBreaker = new CircuitBreaker(databaseOperation, breakerOptions);

// Eventos del Circuit Breaker
circuitBreaker.on('open', () => console.log('Circuit breaker is open!'));
circuitBreaker.on('halfOpen', () => console.log('Circuit breaker is half-open.'));
circuitBreaker.on('close', () => console.log('Circuit breaker is closed.'));
circuitBreaker.on('failure', (error) => console.log('Circuit breaker failure:', error.message));
circuitBreaker.on('success', () => console.log('Circuit breaker success.'));


export const registerPayment = async (req, res) => {
  try {
    const { date, clinicId, status, planId } = req.body;

    try {
      // Usar Circuit Breaker para guardar el pago
      const payment = await circuitBreaker.fire(() => {
        const newPayment = new Payment({ date, clinicId, status, planId });
        return newPayment.save();
      });

      logger.info(`Payment ${payment._id} created`);
      res.status(201).json(payment);
    } catch (error) {
      logger.error('Error creating payment', {
        method: req.method,
        url: req.originalUrl,
        error: error.message,
      });
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const obtainAllPayments = async (req, res) => {
  try {
    // Usar Circuit Breaker para obtener todos los pagos
    const payments = await circuitBreaker.fire(() => Payment.find());

    logger.info('Retrieved all payments', {
      method: req.method,
      url: req.originalUrl,
    });

    res.status(200).json(payments);
  } catch (error) {
    logger.error('Error fetching payments', {
      method: req.method,
      url: req.originalUrl,
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      // Usar Circuit Breaker para obtener un pago por ID
      const payment = await circuitBreaker.fire(() => Payment.findById(id));

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      logger.info(`Payment ${payment._id} retrieved`);
      res.status(200).json(payment);
    } catch (error) {
      logger.error('Error retrieving payment', {
        method: req.method,
        url: req.originalUrl,
        error: error.message,
      });
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      // Usar Circuit Breaker para buscar el pago
      const payment = await circuitBreaker.fire(() => Payment.findById(id));

      if (!payment) {
        logger.error('Payment not found', {
          method: req.method,
          url: req.originalUrl,
        });
        return res.status(404).json({ message: 'Payment not found' });
      }

      // Usar Circuit Breaker para eliminar el pago
      await circuitBreaker.fire(() => payment.deleteOne());

      logger.info(`Payment ${payment._id} deleted`);
      res.status(204).json({ message: 'Payment deleted' });
    } catch (error) {
      logger.error('Error deleting payment', {
        method: req.method,
        url: req.originalUrl,
        error: error.message,
      });
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

