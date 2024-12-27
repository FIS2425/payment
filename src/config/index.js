import mongoose from 'mongoose';
import api from '../api.js';
import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGO_URI = process.env.MONGOURL;
const PORT = process.env.PORT || 3003;

// Initialize Stripe with the secret key from the environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Conexión con MongoDB OK');

    // Initialize your app
    const app = api();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error de conexión con MongoDB:', error.message);
  });
