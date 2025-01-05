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
    _id: '550e8400-e29b-41d4-a716-446655440000',
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
    _id: '123e4567-e89b-12d3-a456-426614174000',
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
    _id: '9f1b5d7a-2c44-481d-94a5-7b3725036df1',
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
    _id: 'c0a80123-16d2-4d7f-8cae-9fd6a07e7f20',
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

  const removeAllPlans = async () => {
    try {
      await Plan.deleteMany({});
      console.log('All Plans have been removed');
    } catch (error) {
      console.error('Error removing Plans:', error);
    }
  };

async function populatePlans() {
  try {
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
  await removeAllPlans();
  await populatePlans();
})();