# Rental Finder Backend

## Description
Spring Boot backend for the Rental Finder application with JWT authentication and MySQL database.

## Features
- User authentication (signup/login) with JWT
- House listing management
- Search functionality
- Image upload support
- RESTful API endpoints

## Technology Stack
- Java 21
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Maven

## Database Configuration
The application is configured to connect to Railway MySQL database:
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
1. Build the project: `mvn clean install`
2. Run the application: `mvn spring-boot:run`
3. The application will start on port 8080

## Environment Variables
- `MYSQLHOST` - MySQL host
- `MYSQLPORT` - MySQL port
- `MYSQLDATABASE` - Database name
- `MYSQLUSER` - Database username
- `MYSQLPASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `PORT` - Application port (default: 8080)
