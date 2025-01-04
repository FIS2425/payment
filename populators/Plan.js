import mongoose from 'mongoose';
import Plan from '../src/schemas/Plan.js';


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

const samplePlans = [
  {
    name: 'Basic',
    price: 15,
    features: [
      '1 clinic',
      'Max File Size: 0.5 GB',
      '2 doctors per clinic',
      '350 patients per clinic',
      'Clinical History Format: PDF',
    ],
  }, {
    name: 'Advanced',
    price: 30,
    features: [
      '3 clinics',
      'Max File Size: 1 GB',
      '15 doctors per clinic',
      '1000 patients per clinic',
      'Clinical History Format: CSV, XML, JSON',
    ],
  }, {
    name: 'Professional',
    price: 45,
    features: [
      '6 clinics',
      'Max File Size: 10 GB',
      '35 doctors per clinic',
      '5000 patients per clinic',
      'Clinical History Format: DICOM, HL7, FHIR',
    ],
  }, {
    name: 'Enterprise',
    price: 100,
    features: [
      'Unlimited clinics',
      'Unlimited File Size',
      'Unlimited doctors per clinic',
      'Unlimited patients per clinic',
      'Clinical History Format: All Supported Formats',
    ],
  }];

async function populatePlans() {
  try {
    // Guardar cada plan
    for (const planData of samplePlans) {
      const plan = new Plan(planData);
      await plan.save();
      console.log('Plan created successfully');
    }

    console.log('All sample plans have been created');
  } catch (error) {
    console.error('Error populating plans:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Ejecutar el script
(async () => {
  await connectToDatabase();
  await populatePlans();
})();