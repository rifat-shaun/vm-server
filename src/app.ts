import cors from 'cors';
import express, { json, urlencoded } from 'express';

import { setupSwagger } from './docs/swagger';
import { errorHandler } from './middlewares/errorHandler';
import { securityMiddleware } from './middlewares/security';
import v1Routes from './routes/v1';

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5555'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(securityMiddleware);

// API Documentation
setupSwagger(app);

// Routes
app.use('/api/v1', v1Routes);

// Error handling
app.use(errorHandler);

export default app;
