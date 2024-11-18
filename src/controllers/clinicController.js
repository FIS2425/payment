import Clinic from '../schemas/Clinic.js';

import logger from '../config/logger.js';

export const registerClinic = async (req, res) => {
  try {
    const {name,city,district,plan,active,postalCode,countryCode } = req.body;
    try {

      const clinic = new Clinic({
        name,
        city,
        district,
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

export const getclinicById = async (req, res) => {
  try {
    const { id } = req.params;
    const clinic = await Clinic.findById(id); 

    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    logger.info(`Clinic ${clinic._id} retrieved`);
    res.status(200).json(clinic);

  } catch (error) {
    logger.error('Error retrieving clinic', {
      method: req.method,
      url: req.originalUrl,
      error: error
    });

    res.status(500).json({ message: 'An error occurred while retrieving the clinic' });
  }
}

export const updateClinic = async (req, res) => {
  try {
    const { id } = req.params;
    const {name,city,district,plan,active,postalCode,countryCode } = req.body;
    const clinic = await Clinic.findById(id);
    
    if (!clinic) {
      logger.error('Clinic not found', {
        method: req.method,
        url: req.originalUrl,
        patientId: id,
      });
      return res.status(404).json({ message: 'Clinic not found' });
    }

    if (name && typeof name !== 'string') {
      return res.status(400).json({ message: 'Invalid name format' });
    }

    if (city && typeof city !== 'string') {
      return res.status(400).json({ message: 'Invalid surname format' });
    }

    if (district && typeof district !== 'string') {
      return res.status(400).json({ message: 'Invalid district format' });
    }

    if (plan && typeof plan !== 'string') {
      return res.status(400).json({ message: 'Invalid plan format' });
    }
    if (active && typeof active !== 'boolean') {
      return res.status(400).json({ message: 'Invalid active format' });
    }
    if (postalCode && typeof postalCode !== 'string') {
      return res.status(400).json({ message: 'Invalid postalCode format' });
    }
    if (countryCode) {
      const countryCodeRegex = /^[A-Z]{2}$/; // Dos letras mayúsculas
      if (typeof countryCode !== 'string' || !countryCodeRegex.test(countryCode)) {
        return res.status(400).json({ message: 'Invalid countryCode format' });
      }
    }
    
    clinic.name = name || clinic.name;
    clinic.city = city || clinic.city;
    clinic.district = district || clinic.district;
    clinic.plan = plan || clinic.plan;
    clinic.active = active || clinic.active;
    clinic.postalCode = postalCode || clinic.postalCode;
    clinic.countryCode = countryCode || clinic.countryCode

    await clinic.save();

    logger.info(`Clinic ${clinic._id} updated successfully`, {
      method: req.method,
      url: req.originalUrl,
    });

    res.status(200).json(clinic);

  } catch (error) {
    logger.error('Error updating clinic', {
      method: req.method,
      url: req.originalUrl,
      error: error.message,
    });
    res.status(400).json({ message: error.message });
  }
};