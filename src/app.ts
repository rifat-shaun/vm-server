import cors from 'cors';
import express, { json, urlencoded } from 'express';

import { setupSwagger } from './docs/swagger';
import { errorHandler } from './middlewares/errorHandler';
import v1Routes from './routes/v1';

const app = express();

// Apply CORS middleware
app.use(cors({
	origin: ['http://localhost:3000', 'http://localhost:5173'],
	methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}));

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
