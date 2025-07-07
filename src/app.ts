import cors from 'cors';
import express, { json, urlencoded } from 'express';

import { setupSwagger } from './docs/swagger';
import { errorHandler } from './middlewares/errorHandler';
import v1Routes from './routes/v1';

const app = express();

const allowedOrigins = ['http://localhost:5173', process.env.BASE_URL];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, origin);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'x-origin'],
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
