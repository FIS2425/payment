import Clinic from '../schemas/Clinic.js';
import logger from '../config/logger.js';
import CircuitBreaker from 'opossum';

// Función genérica para interactuar con la base de datos
const databaseOperation = async (operation) => {
  return await operation();
};

// Configuración del Circuit Breaker
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


export const registerClinic = async (req, res) => {
  try {
    const { name, city, district, plan, active, postalCode, countryCode } = req.body;

    if (!name || !city || !district || !plan || active === undefined || !postalCode || !countryCode) {
      logger.error('Missing fields', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(400).json({ message: 'Missing fields' });
    }

    const clinic = new Clinic({
      name,
      city,
      district,
      plan,
      active,
      postalCode,
      countryCode,
    });

    const clinicSaved = await clinic.save();
    logger.info(`Clinic ${clinicSaved._id} created`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      clinicId: clinicSaved._id,
    });
    res.status(201).json(clinic);
  } catch (error) {
    logger.error('Failed to create clinic', {
      method: req.method,
      url: req.originalUrl,
      error: error,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null
    });
    res.status(500).json({ message: error.message });
  }
};


export const getclinicById = async (req, res) => {
  try {
    const { id } = req.params;
    if(!id) {
      logger.error('Missing clinic ID', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(400).json({ message: 'Missing clinic ID' });
    }
    const clinic = await Clinic.findById(id);
    if (!clinic) {
      logger.error('Clinic not found', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Clinic not found' });
    }
    logger.debug(`Clinic ${clinic._id} retrieved`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(200).json(clinic);
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
};

export const updateClinic = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    if (!id) {
      logger.error('Missing clinic ID', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(400).json({ message: 'Missing clinic ID' });
    }

    const updatedClinic = await Clinic.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedClinic) {
      logger.error('Clinic not found', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Clinic not found' });
    }
    logger.info(`Clinic ${updatedClinic._id} updated`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      clinicId: updatedClinic._id,
    });
    res.status(200).json(updatedClinic);
  } catch (error) {
    logger.error('Error updating clinic', {
      method: req.method,
      url: req.originalUrl,
      error: error,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null
    });
    res.status(500).json({ message: error.message });
  }
};

export const obtainAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find();
    logger.debug(`Retrieved ${clinics.length} clinics`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(200).json(clinics);
  } catch (error) {
    logger.error('Error fetching clinics', {
      method: req.method,
      url: req.originalUrl,
      error: error,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(500).json({ message: error.message });
  }
};


export const deleteClinic = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.error('Missing clinic ID', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(400).json({ message: 'Missing clinic ID' });
    }

    const clinic = await Clinic.findByIdAndDelete(id);
    if (!clinic) {
      logger.error('Clinic not found', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Clinic not found' });
    }
    logger.info(`Clinic ${clinic._id} deleted`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      clinicId: clinic._id,
    });
    res.status(200).json(clinic);
  } catch (error) {
    logger.error('Error deleting clinic', {
      method: req.method,
      url: req.originalUrl,
      error: error,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null
    });
    res.status(500).json({ message: error.message });
  }
};
