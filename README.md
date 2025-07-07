# Node.js Express API with TypeScript

A robust, secure, and scalable REST API built with Node.js, Express, and TypeScript. This project includes authentication, user management, and comprehensive API documentation.

## Features

- 🔐 **Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control
  - Password reset functionality
  - Secure password hashing

- 🛡️ **Security**

  - CORS protection
  - Helmet security headers
  - Rate limiting
  - Input validation
  - XSS protection

- 📚 **API Documentation**

  - Swagger/OpenAPI documentation
  - Interactive API explorer
  - Request/response schemas
  - Authentication requirements

- 🏗️ **Architecture**
  - Clean architecture
  - Dependency injection
  - Middleware-based security
  - Error handling
  - Environment configuration

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   # Server
   NODE_ENV=development
   PORT=3000
   CORS_ORIGINS=http://localhost:3000,http://localhost:5555

   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name

   # Authentication
   JWT_SECRET=your-secret-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

Access the API documentation at `http://localhost:3000/api-docs`. The documentation includes:

- Authentication endpoints
- User management endpoints
- Request/response schemas
- Authentication requirements
- Example requests

## Security Features

### CORS Configuration

```typescript
cors({
  origin: config.server.corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
});
```

### Helmet Security Headers

```typescript
helmet({
  xssFilter: true,
  hidePoweredBy: true,
  frameguard: { action: 'deny' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
});
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── docs/          # API documentation
├── middlewares/   # Custom middlewares
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
├── types/         # TypeScript types
├── utils/         # Utility functions
├── app.ts         # Express app setup
└── server.ts      # Server entry point
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/forgot-password` - Request password reset

### User Management

- `GET /api/v1/users/{userId}` - Get user details
- `PUT /api/v1/users/{userId}` - Update user details

## Error Handling

The API uses a standardized error response format:

```typescript
{
  success: false,
  message: string,
  errors?: {
    code: string,
    details?: Record<string, string>
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
