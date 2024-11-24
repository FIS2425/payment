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

    const clinicData = {
      name,
      city,
      district,
      plan,
      active,
      postalCode,
      countryCode,
    };

    try {
      // Usar Circuit Breaker para la operación de guardar
      const clinic = await circuitBreaker.fire(() => {
        const newClinic = new Clinic(clinicData);
        return newClinic.save();
      });

      logger.info(`Clinic ${clinic._id} created`);
      res.status(201).json(clinic);
    } catch (error) {
      logger.error('Failed to create clinic', {
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


export const getclinicById = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      // Usar Circuit Breaker para buscar la clínica
      const clinic = await circuitBreaker.fire(() => Clinic.findById(id));

      if (!clinic) {
        return res.status(404).json({ message: 'Clinic not found' });
      }

      logger.info(`Clinic ${clinic._id} retrieved`);
      res.status(200).json(clinic);
    } catch (error) {
      logger.error('Error retrieving clinic', {
        method: req.method,
        url: req.originalUrl,
        error: error.message,
      });

      res.status(500).json({ message: 'An error occurred while retrieving the clinic' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const updateClinic = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, district, plan, active, postalCode, countryCode } = req.body;

    try {
      // Usar Circuit Breaker para encontrar la clínica
      const clinic = await circuitBreaker.fire(() => Clinic.findById(id));

      if (!clinic) {
        logger.error('Clinic not found', {
          method: req.method,
          url: req.originalUrl,
          patientId: id,
        });
        return res.status(404).json({ message: 'Clinic not found' });
      }

      // Validaciones de los campos
      if (name && typeof name !== 'string') {
        return res.status(400).json({ message: 'Invalid name format' });
      }
      if (city && typeof city !== 'string') {
        return res.status(400).json({ message: 'Invalid city format' });
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

      // Actualizar los campos
      clinic.name = name || clinic.name;
      clinic.city = city || clinic.city;
      clinic.district = district || clinic.district;
      clinic.plan = plan || clinic.plan;
      clinic.active = active || clinic.active;
      clinic.postalCode = postalCode || clinic.postalCode;
      clinic.countryCode = countryCode || clinic.countryCode;

      // Usar Circuit Breaker para guardar la clínica
      await circuitBreaker.fire(() => clinic.save());

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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const obtainAllClinics = async (req, res) => {
  try {
    // Usar Circuit Breaker para obtener todas las clínicas
    const clinics = await circuitBreaker.fire(() => Clinic.find());

    logger.info('Retrieved all clinics', {
      method: req.method,
      url: req.originalUrl,
    });

    res.status(200).json(clinics);
  } catch (error) {
    logger.error('Error fetching clinics', {
      method: req.method,
      url: req.originalUrl,
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
};

export const deleteClinic = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      // Usar Circuit Breaker para eliminar la clínica
      const clinic = await circuitBreaker.fire(() => Clinic.findById(id));

      if (!clinic) {
        return res.status(404).json({ message: 'Clinic not found' });
      }

      await circuitBreaker.fire(() => clinic.deleteOne());
      logger.info(`Clinic ${clinic._id} deleted`);
      res.status(204).json({ message: 'Clinic deleted' });
    } catch (error) {
      logger.error('Error deleting clinic', {
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

export const deactivateClinic = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      // Usar Circuit Breaker para encontrar la clínica
      const clinic = await circuitBreaker.fire(() => Clinic.findById(id));

      if (!clinic) {
        logger.error('Clinic not found', {
          method: req.method,
          url: req.originalUrl,
          patientId: id,
        });
        return res.status(404).json({ message: 'Clinic not found' });
      }

      // Desactivar la clínica
      clinic.active = false;

      // Usar Circuit Breaker para guardar los cambios
      await circuitBreaker.fire(() => clinic.save());

      logger.info(`Clinic ${clinic._id} deactivated successfully`, {
        method: req.method,
        url: req.originalUrl,
      });

      res.status(200).json(clinic);
    } catch (error) {
      logger.error('Error deactivating clinic', {
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
