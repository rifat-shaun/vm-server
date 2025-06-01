import express, { json, urlencoded } from 'express';

import { setupSwagger } from './docs/swagger';
import { errorHandler } from './middlewares/errorHandler';
import { securityMiddleware } from './middlewares/security';
import v1Routes from './routes/v1';

const app = express();

// Apply security middleware
app.use(securityMiddleware);

// Body parsing middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// API Documentation
setupSwagger(app);

// Routes
app.use('/api/v1', v1Routes);

// Error handling
app.use(errorHandler);

export default app;
