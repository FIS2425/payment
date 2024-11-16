import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import Clinic from '../../../src/schemas/Clinic.js';
import * as db from '../../setup/database.js';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import app from '../../../src/app.js'; // Asegúrate de importar tu aplicación de Express

beforeAll(async () => {
  await db.clearDatabase();
});

afterAll(async () => {
  await db.clearDatabase();
});

describe('CLINIC ENDPOINTS TEST', () => {
  describe('test POST /register', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/register').send({});

      // Expect the error message to be "All fields are required." based on the updated validation
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required.');
    });

    it('should return 201 and create a new clinic if all required fields are provided', async () => {
      const newClinic = {
        name: 'Clínica San Juan',
        city: 'Barcelona',
        district: '2023-11-14T00:00:00.000Z',
        plan: 'Premium',
        active: true,
        postalCode: '08001',
        countryCode: 'ES',
      };
      const response = await request(app).post('/register').send(newClinic);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newClinic.name);
      expect(response.body.city).toBe(newClinic.city);
      expect(response.body.district).toBe(new Date(newClinic.district).toISOString());
      expect(response.body.plan).toBe(newClinic.plan);
      expect(response.body.active).toBe(newClinic.active);
      expect(response.body.postalCode).toBe(newClinic.postalCode);
      expect(response.body.countryCode).toBe(newClinic.countryCode);
    });
  });
});
