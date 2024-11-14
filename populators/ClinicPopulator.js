import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Patient from '../src/schemas/Clinic.js';

const MONGO_URI = process.env.MONGOURL;

const connectToDatabase = async () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error.message);
    });
};

// Sample Patient data
const sample = [
  
  {
    name: 'Clínica Salud',
    city: 'Madrid',
    district: new Date('2023-11-10T00:00:00.000Z'),
    plan: 'Plan Básico',
    active: true,
    postalCode: '28001',
    countryCode: 'ES', // Código ISO 3166-1 Alpha-2 válido
  }
];

async function populatePatients() {
  try {
    // Save each Patient
    for (const apptData of sample) {
      const pacientes = new Patient(apptData);
      await pacientes.save();
      console.log('Patient created successfully');
    }

    console.log('All sample Patients have been created');
  } catch (error) {
    console.error('Error populating Patients:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Run the script
(async () => {
  await connectToDatabase();
  await populatePatients();
})();
