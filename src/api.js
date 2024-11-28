import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import cookieParser from 'cookie-parser';
import paymentRoute from './routes/paymentRoute.js';
import plansRoute from './routes/planRoute.js';
import clinicRoute from './routes/clinicRoute.js';

const swaggerDocument = YAML.load('./openapi.yaml');

export default function () {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(`${process.env.API_PREFIX || ''}/payments` ,paymentRoute);
  app.use(`${process.env.API_PREFIX || ''}/plans`, plansRoute);
  app.use(`${process.env.API_PREFIX || ''}/clinics`, clinicRoute);
  app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
  });

  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  
  return app;
}
