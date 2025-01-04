import logger from '../config/logger.js';
import Plan from '../schemas/Plan.js';

export const obtainAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    
    logger.debug(`Retrieved ${plans.length} plans`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(200).json(plans);

  } catch (error) {
    logger.error('Error fetching plans', {
      method: req.method,
      url: req.originalUrl,
      error: error,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });

    res.status(500).json({ message: error.message });
  }
}

export const obtainPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    if(!id) {
      logger.error('Missing plan ID', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(400).json({ message: 'Missing plan ID' });
    }
    const plan = await Plan.findById(id);
    if (!plan) {
      logger.error('Plan not found', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'plan not found' });
    }
    logger.debug(`Plan ${plan._id} retrieved`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(200).json(plan);
  } catch (error) {
    logger.error('Error retrieving clinic', {
      method: req.method,
      url: req.originalUrl,
      error: error,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(500).json({ message: error.message });
  }
}