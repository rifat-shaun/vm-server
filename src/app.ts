import express from 'express';
import cors from 'cors';
import { setupSwagger } from './docs';
import { errorHandler } from './middlewares/errorHandler';
import v1Routes from './routes/v1';
import { securityMiddleware } from './middleware/security';

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
