import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Clinic from '../src/schemas/Clinic.js'; // Ajusta la ruta si es necesario

dotenv.config();

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

// Datos de ejemplo para las clínicas
const sampleClinics = [
  {
    name: "Clinic One",
    city: "City One",
    district: "District One",
    plan: "Plan One",
    active: true,
  },
  // Agrega más clínicas si es necesario
];

async function populateClinics() {
  try {
    // Guardar cada clínica
    for (const clinicData of sampleClinics) {
      const clinic = new Clinic(clinicData);
      await clinic.save();
      console.log('Clinic created successfully');
    }

    console.log('All sample clinics have been created');
  } catch (error) {
    console.error('Error populating clinics:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Ejecutar el script
(async () => {
  await connectToDatabase();
  await populateClinics();
})();