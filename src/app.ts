import cors from 'cors';
import express from 'express';

import { setupSwagger } from './config/swagger';
import { securityMiddleware } from './middleware/security';
import { errorHandler } from './middlewares/errorHandler';
import v1Routes from './routes/v1';

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5555'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply security middleware
app.use(securityMiddleware);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);
app.use('/api/v1', v1Routes);

// Error handling
app.use(errorHandler);

export default app;
