import mongoose from 'mongoose';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

// Enum for PaymentStatus
const PaymentStatusEnum = ['Pending', 'Completed', 'Failed'];

// Payment Schema
const PaymentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
    validate: {
      validator: (v) => uuidValidate(v),
      message: (props) => `${props.value} is not a valid UUID`,
    },
  },
  date: {
    type: Date,
    default: Date.now, // Default to the current date and time
  },
  clinicId: {
    type: String,
    required: true, // UUID for the clinic
  },
  status: {
    type: String,
    enum: PaymentStatusEnum, // Enum validation
    default: 'Pending', // Default status
  },
  planId: {
    type: String,
    required: true, // UUID for the plan
  },
});

// Model
const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
