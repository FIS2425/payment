import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import cookieParser from 'cookie-parser';
import paymentRoute from './routes/paymentRoute.js';
import plansRoute from './routes/planRoute.js';
import clinicRoute from './routes/clinicRoute.js';
import { paymentPermissions } from './middleware/verifyAuth.js';
import logger from './config/logger.js';
import KafkaTransport from './utils/kafkaTransport.js';

const swaggerDocument = YAML.load('./openapi.yaml');

export default function () {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(`${process.env.API_PREFIX || ''}/payments` , paymentPermissions, paymentRoute);
  app.use(`${process.env.API_PREFIX || ''}/plans`, plansRoute);
  app.use(`${process.env.API_PREFIX || ''}/clinics`, clinicRoute);
  app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
  });

  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  
  return app;
}

async function shutdown() {
  console.log('Shutting down the application...');

  if (process.env.NODE_ENV === 'production') {
    try {
      for (const transport of logger.transports) {
        if (transport instanceof KafkaTransport) {
          await transport.close();
          console.log('Kafka producer disconnected');
        }
      }
    } catch (error) {
      console.error('Error disconnecting Kafka producer:', error);
    }
  }

  console.log('HTTP server closed');
  process.exit(0);
}

process.on('SIGINT', async () => {
  console.log('SIGINT received');
  await shutdown();
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  await shutdown();
});

process.on('uncaughtException', async (error) => {
  console.error('Uncaught exception:', error);
  await shutdown();
});

process.on('unhandledRejection', async (reason) => {
  console.error('Unhandled promise rejection:', reason);
  await shutdown();
});
