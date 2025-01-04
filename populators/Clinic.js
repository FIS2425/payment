import mongoose from 'mongoose';
import Clinic from '../src/schemas/Clinic.js'; // Ajusta la ruta si es necesario

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
    _id: '27163ac7-4f4d-4669-a0c1-4b8538405475',
    name: 'Clínica Plaza del Duque',
    city: 'Sevilla',
    district: 'Distrito Centro',
    plan: '550e8400-e29b-41d4-a716-446655440000',
    postalCode: '41001',
    countryCode: 'ES',
    active: true,
  },
  {
    _id: '5b431574-d2ab-41d3-b1dd-84b06f2bd1a0',
    name: 'Clínica Distrito Nervión',
    city: 'Sevilla',
    district: 'Distrito Nervión',
    plan: '123e4567-e89b-12d3-a456-426614174000',
    postalCode: '41018',
    countryCode: 'ES',
    active: true,
  }
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