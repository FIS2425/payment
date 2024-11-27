import mongoose from 'mongoose';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

const PlanSchema = new mongoose.Schema({

  _id: {
    type: String,
    default: () => uuidv4(),
    validate: {
      validator: (v) => uuidValidate(v),
      message: (props) => `${props.value} is not a valid UUID`,
    },
  },

  name: { 
    type: String, 
    required: true },

  price: { 
    type: Number, 
    required: false },

  features: { 
    type: [String], 
    required: true },
});

const Plan = mongoose.model('Plan', PlanSchema);

export default Plan;