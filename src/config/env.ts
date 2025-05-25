import path from 'path';

import { config } from 'dotenv';

// Load environment variables from .env file
const result = config({
  path: path.resolve(process.cwd(), '.env')
});

if (result.error) {
  throw new Error('Failed to load .env file');
}

// Validate that required environment variables are present
const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL', 'NODE_ENV'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export default result.parsed;
