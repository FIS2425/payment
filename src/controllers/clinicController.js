import Clinic from '../schemas/Clinic.js';

import logger from '../config/logger.js';

export const register = async (req, res) => {
  try {
    const {name,city,district,plan,active,postalCode,countryCode } = req.body;
    try {

      const clinic = new Clinic({
        name,
        city,
        district: new Date(district), // Conversión a Date
        plan,
        active,
        postalCode,
        countryCode
      });

      await clinic.save();
      logger.info(`Clinic ${clinic._id} created`);
      res.status(201).json(clinic);

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