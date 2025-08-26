# Rental Finder Frontend

## Description
React frontend for the Rental Finder application with modern UI and responsive design.

## Features
- User authentication (signup/login)
- House search and filtering
- House listing management
- Responsive design with Tailwind CSS
- Image upload support
- District and city selection

## Technology Stack
- React 18.2.0
- Vite 5.0.0
- Tailwind CSS 3.4.0
- Axios for API calls
- React Router for navigation

## Project Structure
```
frontend-deploy/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── context/       # React context providers
│   └── App.jsx        # Main app component
├── public/            # Static assets
├── package.json       # Dependencies
└── vite.config.js     # Vite configuration
```

## Installation
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Configuration
The frontend is configured to connect to the backend API running on port 8080.
Update the API base URL in the configuration if needed.

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment
The application can be deployed to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- Railway

## Environment Variables
- `VITE_API_URL` - Backend API URL (default: http://localhost:8080)
