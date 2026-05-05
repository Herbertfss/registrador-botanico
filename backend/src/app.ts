import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { config } from 'dotenv';
import { authRouter } from './modules/plant/infra/http/PlantController';
import { plantRouter } from './modules/plant/infra/http/PlantRoutes';
import { errorHandler } from './common/middleware/errorHandler';
import { notFoundHandler } from './common/middleware/notFound';

config();

const app = express();

app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173'] }));
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Registrador Botânico API',
      version: '0.1.0',
      description: 'API corporativa para identificação de plantas.',
    },
  },
  apis: ['./src/modules/plant/infra/http/*.ts'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', authRouter);
app.use('/api', plantRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
