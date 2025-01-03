import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import Clinic from '../../../src/schemas/Clinic.js';
import Payment from '../../../src/schemas/Payment.js';
import * as db from '../../setup/database';
import { request } from '../../setup/setup';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import Plan from '../../../src/schemas/Plan.js';

const sampleUser = {
  _id: uuidv4(),
  email: 'testuser2@mail.com',
  password: 'pAssw0rd!',
  roles: ['admin', 'clinicadmin'],
};

const plan = {
  _id: uuidv4(),
  name: 'Premium',
  price: 100,
  features: ['feature1', 'feature2'],
};

beforeAll(async () => {
  await db.clearDatabase();
  const token = jwt.sign(
    { userId: sampleUser._id, roles: sampleUser.roles },
    process.env.VITE_JWT_SECRET
  );
  request.set('Cookie', `token=${token}`);
  await new Plan(plan).save();
});

afterAll(async () => {
  await db.clearDatabase();
});

describe('GET /clinics', () => {
  it('should return 200 and all clinics', async () => {
    const response = await request.get('/clinics');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
describe('GET /payments', () => {
  it('should return 200 and all payments', async () => {
    const response = await request.get('/payments');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('CLINIC ENDPOINTS TEST', () => {
  describe('test POST /clinics', () => {

    it('should return 201 and create a new patient if all required fields are provided', async () => {
      
      const newClinic = {
        _id: uuidv4(), // Se genera automáticamente si no se proporciona
        name: 'HealthCare Plus',
        city: 'Barcelona',
        district: 'Sants',
        plan: 'Premium',
        active: true,
        postalCode: '08001',
        countryCode: 'ES', // Código de país ISO 3166-1 Alpha-2
         
      };
      const response = await request.post('/clinics').send(newClinic);
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newClinic.name);
      expect(response.body.surname).toBe(newClinic.surname);
    });
  });
});

// describe('PAYMENT ENDPOINTS TEST', () => {
//   describe('test POST /payments', () => {

//     it('should return 201 and create a new patient if all required fields are provided', async () => {
//       const newPayment = {
//         _id: uuidv4(), // Genera un UUID automáticamente
//         date: new Date(), // Fecha actual
//         clinicId: uuidv4(), // UUID de la clínica asociada
//         status: 'Pending', // Estado del pago, por defecto 'Pending'
//         planId: plan._id,
//       };
//       const response = await request.post('/payments').send(newPayment);
//       expect(response.status).toBe(201);
//       expect(response.body.name).toBe(newPayment.name);
//       expect(response.body.surname).toBe(newPayment.surname);
//     });
//   });
// });

describe('test GET clinics/:id', () => {
  it('should return 404 if clinic is not found', async () => {
    const response = await request.get(`/clinics/${uuidv4()}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Clinic not found');
  });

  it('should return 200 and the Clinic if found', async () => {
    const newClinic = new Clinic({
      _id: 'b4e3e2a2-1f94-4ecf-a04e-568e4d82d1fa',
      name: 'HealthCare Plus',
      city: 'Barcelona',
      district: 'Eixample',
      plan: 'Premium',
      active: true,
      postalCode: '08001',
      countryCode: 'ES',
    });
    await newClinic.save();

    const response = await request.get('/clinics/b4e3e2a2-1f94-4ecf-a04e-568e4d82d1fa');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(newClinic.name);
  }); 
});

describe('test GET payments/:id', () => {
  it('should return 404 if payment is not found', async () => {
    const response = await request.get(`/payments/${uuidv4()}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Payment not found');
  });

  it('should return 200 and the Payment if found', async () => {
    const newPayment = new Payment({
      _id: 'b4e3e2a2-1f94-4ecf-a04e-568e4d82d1fa',
      date: new Date(), // Fecha actual
      clinicId: uuidv4(), // UUID de la clínica asociada
      status: 'Pending', // Estado del pago, por defecto 'Pending'
      planId: uuidv4(), 
    });
    await newPayment.save();

    const response = await request.get('/payments/b4e3e2a2-1f94-4ecf-a04e-568e4d82d1fa');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(newPayment.name);
  }); 
});
describe('test clinics/:id', () => {
  it('should return 204 if clinic is successfully deleted', async () => {
    const newClinic = new Clinic({
      _id: '9f1eb02b-f985-4637-93c4-b97524b720fe',
      name: 'HealthCare Plus2',
      city: 'Barcelona',
      district: 'Eixample',
      plan: 'Premium',
      active: true,
      postalCode: '08001',
      countryCode: 'ES',
    });
    await newClinic.save();

    const response = await request.delete(`/clinics/${newClinic._id}`);
    expect(response.status).toBe(204);
  });
});

describe('test PUT clinics/:id', () => {
  it('should return 404 if Clinic is not found', async () => {
    const response = await request.put(`/clinics/${uuidv4()}`).send({ name: 'Updated Name' });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Clinic not found');
  });

  // it('should return 400 if any field is invalid', async () => {
  //   const newClinic = new Clinic({
  //     _id: '09c02371-6421-4809-bd55-10e1c1e37f49',
  //     name: 'HealthCare Plus2',
  //     city: 'Barcelona',
  //     district: 'Eixample',
  //     plan: 'Premium',
  //     active: true,
  //     postalCode: '08001',
  //     countryCode: 'ES'
  //   });
  //   await newClinic.save();

  //   const response = await request.put(`/clinics/${newClinic._id}`).send({ countryCode: 'ES0' });
  //   expect(response.status).toBe(400);
  //   expect(response.body.message).toBe('Invalid countryCode format');
  // });

  it('should return 200 and update the Clinic if valid fields are provided', async () => {
    const newClinic = new Clinic({
      name: 'HealthCare Plus2',
      city: 'Barcelona',
      district: 'Eixample',
      plan: 'Premium',
      active: true,
      postalCode: '08001',
      countryCode: 'ES',
      _id: '09c02371-6421-4809-bd55-10e1c1e37f49'
    });
    await newClinic.save();

    const updatedData = { name: 'Mark Updated', city: 'GRANADA' };
    const response = await request.put(`/clinics/${newClinic._id}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.city).toBe(updatedData.city);
  });
});