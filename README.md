# Task Manager App

A full-stack task management application with user authentication, built with **React** (frontend), **Node.js/Express** (backend), and **MongoDB** (database).

## Features

- 🔐 User Authentication (Register/Login with JWT)
- ✅ Task Management (CRUD operations)
- 📋 Task Properties (Title, Description, Due Date, Priority, Completion Status)
- 👤 User-specific Tasks
- 👥 Admin Dashboard (View all registered users)
- 🎨 Modern React UI with responsive design

## Tech Stack

### Frontend
- React 18
- React Router v6
- Vite (build tool)
- Modern CSS with gradients and animations

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Setup

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user
4. Get your connection string
5. Create a `.env` file in the **root directory**:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/todoapp?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3002
```

### 2. Install Dependencies

Install backend dependencies:
```bash
npm install
```

Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

### 3. Run the Application

#### Development Mode (Both servers)
Run both backend and frontend dev servers concurrently:
```bash
npm run dev
```
- Backend runs on: `http://localhost:3002`
- Frontend runs on: `http://localhost:5173`
- Vite proxies `/api` requests to the backend

#### Production Mode
Build the React app and serve it from the backend:
```bash
npm run build
npm start
```
- Full app runs on: `http://localhost:3002`

## Available Scripts

- `npm run dev` - Run both backend and frontend in development mode
- `npm run server` - Run only the backend server (with nodemon)
- `npm run client` - Run only the frontend dev server
- `npm run build` - Build the React app for production
- `npm start` - Run the backend server in production mode

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/users` - Get all registered users (admin)

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

All task endpoints require authentication via `Authorization: Bearer <token>` header.

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components (Navbar)
│   │   ├── context/       # Auth context for state management
│   │   ├── pages/         # Page components (Login, Register, Home, Admin)
│   │   ├── services/      # API service layer
│   │   ├── App.jsx        # Main app with routing
│   │   ├── main.jsx       # React entry point
│   │   └── styles.css     # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── models/                # Mongoose models
│   ├── User.js
│   └── Task.js
├── routes/                # Express routes
│   ├── auth.js
│   └── tasks.js
├── middleware/            # Custom middleware
│   └── auth.js           # JWT authentication
├── server.js             # Express server
├── package.json          # Backend dependencies
└── .env                  # Environment variables
```

## Usage

1. **Register** a new account at `/register`
2. **Login** with your credentials at `/login`
3. **Create tasks** on the home page with title, description, priority, and due date
4. **Mark tasks** as complete by checking the checkbox
5. **Delete tasks** using the delete button
6. **View users** on the admin dashboard at `/admin-dashboard`

## Development Notes

- The frontend uses React Context API for authentication state management
- JWT tokens are stored in localStorage
- All API calls include the token in the Authorization header
- The backend serves the React build in production mode
- CORS is enabled for development (Vite dev server on port 5173)
