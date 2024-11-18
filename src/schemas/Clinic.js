import mongoose from 'mongoose';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { getCode, getNames } from 'country-list';

const countryCodes = getNames().map((name) => getCode(name));

const clinicSchema = new mongoose.Schema({
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
    required: true
  },
  city: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true,
    uppercase: true,
    validate: {
      validator: function (v) {
        return countryCodes.includes(v);
      },
      message: (props) => `${props.value} no es un código de país ISO 3166-1 Alpha-2 válido.`,
    },
  }
}, {
  timestamps: true
});

const Clinic = mongoose.models.Clinic || mongoose.model('Clinic', clinicSchema);
export default Clinic;