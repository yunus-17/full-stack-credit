# React Frontend - Todo App

This is the React frontend for the Todo application, built with Vite.

## 🏗️ Architecture

### Pages
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration
- **Home** (`/`) - Task management dashboard (protected)
- **Admin Dashboard** (`/admin-dashboard`) - View all users (protected)

### Components
- **Navbar** - Navigation bar with auth state and logout

### Context
- **AuthContext** - Global authentication state management
  - Stores JWT token and user info
  - Persists to localStorage
  - Provides logout functionality

### Services
- **api.js** - Centralized API fetch utilities
  - Handles authentication headers
  - Error handling
  - Base URL configuration

## 🎨 Styling

Global styles in `src/styles.css`:
- Purple gradient theme
- Responsive design
- Modern card-based layout
- Smooth animations

## 🔌 API Integration

All API calls go through the service layer:
- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/users`
- **Tasks**: `/api/tasks` (GET, POST, PUT, DELETE)

Authentication uses JWT tokens in `Authorization: Bearer <token>` header.

## 🚀 Development

```bash
npm install    # Install dependencies
npm run dev    # Start dev server on port 5173
npm run build  # Build for production
```

## 📦 Dependencies

- **react** & **react-dom** - UI library
- **react-router-dom** - Client-side routing
- **vite** - Build tool and dev server

## 🔧 Configuration

`vite.config.js` proxies `/api` requests to `http://localhost:3002` (backend).

## 🎯 Features

- Protected routes (redirect to login if not authenticated)
- Real-time UI updates (no page refresh)
- Form validation
- Loading states
- Error handling
- Responsive design
