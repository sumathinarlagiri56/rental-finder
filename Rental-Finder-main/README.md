# Rental Finder - Full Stack Application

A complete rental property finder application with user authentication, house listings, and search functionality.

## Project Structure

```
full-stack-project/
├── backend/          # Spring Boot Backend
├── frontend/         # React Frontend
└── README.md         # This file
```

## Features

### Backend (Spring Boot)
- User authentication with JWT
- House listing management
- Search and filtering
- Image upload support
- RESTful API endpoints
- MySQL database integration

### Frontend (React)
- Modern responsive UI with Tailwind CSS
- User authentication (signup/login)
- House search and filtering
- House listing management
- District and city selection
- Image upload support

## Technology Stack

### Backend
- Java 21
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- React 18.2.0
- Vite 5.0.0
- Tailwind CSS 3.4.0
- Axios for API calls
- React Router for navigation

## Quick Start

### Backend Setup
1. Navigate to backend folder: `cd backend`
2. Build the project: `mvn clean install`
3. Run the application: `mvn spring-boot:run`
4. Backend will start on: `http://localhost:8080`

### Frontend Setup
1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Frontend will start on: `http://localhost:3000`

## Database Configuration

The backend is configured to connect to Railway MySQL database:
- Host: gondola.proxy.rlwy.net
- Port: 35970
- Database: railway
- Username: root

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Houses
- `GET /houses/search` - Search houses
- `GET /houses/districts` - Get districts
- `GET /houses/cities/{district}` - Get cities by district
- `POST /houses` - Add new house (authenticated)
- `GET /houses/my` - Get user's houses (authenticated)
- `GET /houses/image/{id}` - Get house image

### User
- `GET /user/profile` - Get user profile (authenticated)

## Deployment

### Backend Deployment (Railway)
1. Push the backend folder to a separate repository
2. Connect to Railway
3. Set environment variables for database connection
4. Deploy

### Frontend Deployment (Netlify/Vercel)
1. Push the frontend folder to a separate repository
2. Connect to Netlify or Vercel
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy

## Environment Variables

### Backend
- `MYSQLHOST` - MySQL host
- `MYSQLPORT` - MySQL port
- `MYSQLDATABASE` - Database name
- `MYSQLUSER` - Database username
- `MYSQLPASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `PORT` - Application port (default: 8080)

### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:8080)

## Live Demo

- Backend API: [Your Railway Backend URL]
- Frontend: [Your Frontend URL]

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
