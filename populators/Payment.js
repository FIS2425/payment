import mongoose from 'mongoose';
import Payment from '../src/schemas/Payment.js';

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

const samplePayments = [
{
  _id: '123e4567-e89b-12d3-a456-426615174000',
  date: new Date(),
  status: 'Completed',
  planId: '123e4567-e89b-12d3-a456-426614174000',
  clinicId: '5b431574-d2ab-41d3-b1dd-84b06f2bd1a0',
  amount: 150,
},
{
  _id: '123e4567-e89b-12d3-a656-426614174001',
  date: new Date(),
  status: 'Completed',
  planId: '550e8400-e29b-41d4-a716-446655440000',
  clinicId: '27163ac7-4f4d-4669-a0c1-4b8538405475',
  amount: 300,
}
];

const removeAllPayments = async () => {
    try {
      await Payment.deleteMany({});
      console.log('All Payment  have been removed');
    } catch (error) {
      console.error('Error removing Payment:', error);
    }
  };

const populatePayments = async () => {
  try {
    await connectToDatabase();
    await Payment.insertMany(samplePayments);
    console.log('Payment data populated successfully!');
  } catch (error) {
    console.error('Error populating Payment data:', error.message);
  } finally {
    mongoose.connection.close();
  }
};


(async () => {
    await connectToDatabase();
    await removeAllPayments();
    await populatePayments();
  })();
