# Uber-like Application

A full-stack ride-hailing application with admin dashboard, driver management, and real-time ride tracking.

## Project Structure

```
├── server/             # Backend API server
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   ├── utils/         # Utility functions
│   └── server.js      # Main server file
│
└── admin/             # Admin dashboard
    ├── public/        # Static files
    └── src/           # React source code
        ├── components/  # Reusable components
        ├── contexts/    # React contexts
        ├── pages/       # Page components
        └── App.js       # Main React component
```

## Features

### Server
- User authentication and authorization (JWT)
- Role-based access control (Admin, Driver, Rider)
- Ride management (booking, tracking, completion)
- Driver management (location updates, availability)
- Real-time location tracking
- Payment simulation
- Comprehensive error handling and logging

### Admin Dashboard
- Modern, responsive UI built with React and Tailwind CSS
- Real-time statistics and metrics
- User management (riders and drivers)
- Ride monitoring and management
- Driver tracking and status management
- Interactive maps for ride visualization
- Comprehensive reporting and analytics

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT)
- WebSocket (for real-time features)

### Frontend (Admin Dashboard)
- React
- Tailwind CSS
- React Router
- Chart.js (for analytics)
- Heroicons
- Axios

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/uber-like-app
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Admin Dashboard Setup

1. Navigate to the admin directory:
   ```bash
   cd admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile
- PUT /api/auth/profile - Update user profile

### Ride Endpoints
- POST /api/rides - Create new ride
- GET /api/rides - Get all rides
- GET /api/rides/:id - Get specific ride
- PUT /api/rides/:id/accept - Accept ride (drivers only)
- PUT /api/rides/:id/complete - Complete ride
- PUT /api/rides/:id/cancel - Cancel ride

### Driver Endpoints
- PUT /api/drivers/location - Update driver location
- PUT /api/drivers/availability - Update driver availability
- GET /api/drivers/statistics - Get driver statistics
- GET /api/drivers/nearby-requests - Get nearby ride requests

## Security Considerations

- JWT-based authentication
- Password hashing using bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Secure HTTP headers using helmet
- Environment variable management
- Error handling and logging

## Development Guidelines

1. Code Style
   - Use ESLint for code linting
   - Follow Airbnb JavaScript Style Guide
   - Use meaningful variable and function names
   - Add comments for complex logic

2. Git Workflow
   - Create feature branches from develop
   - Use meaningful commit messages
   - Review code before merging
   - Keep commits atomic and focused

3. Testing
   - Write unit tests for critical functions
   - Test API endpoints using Postman/Insomnia
   - Perform manual testing for UI components
   - Test across different browsers and devices

## Deployment

1. Server Deployment
   - Set up production MongoDB instance
   - Configure environment variables
   - Set up PM2 for process management
   - Configure Nginx as reverse proxy
   - Enable SSL/TLS

2. Admin Dashboard Deployment
   - Build production bundle
   - Configure environment variables
   - Set up CDN for static assets
   - Configure web server
   - Enable SSL/TLS

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request