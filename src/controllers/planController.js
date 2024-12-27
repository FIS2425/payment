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