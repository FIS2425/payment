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
export const obtainAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find(); // Encuentra todos los pacientes
    res.status(200).json(clinics);
  } catch (error) {
    logger.error('Error fetching clinics', {
      method: req.method,
      url: req.originalUrl,
      error: error
    });
    res.status(500).json({ message: error.message });
  }
}