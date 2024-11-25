import logger from '../config/logger.js';
import Plan from '../schemas/Plan.js';

export const obtainAllPlans = async (req, res) => {
  logger.info('Request received to obtain all plans', {
    method: req.method,
    url: req.originalUrl,
  });

  try {
    const plans = await Plan.find();
    logger.info('Plans fetched successfully', {
      method: req.method,
      url: req.originalUrl,
      plansCount: plans.length,
    });
    res.status(200).json(plans);

  } catch (error) {
    logger.error('Error fetching plans', {
      method: req.method,
      url: req.originalUrl,
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
}