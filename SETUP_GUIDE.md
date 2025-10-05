# Quick Setup Guide - React Migration

Your project has been successfully migrated to React! Follow these steps to get started.

## 🚀 Quick Start

### Step 1: Install Backend Dependencies
```bash
npm install
```

This installs:
- Express, Mongoose, JWT, bcrypt (existing backend deps)
- **concurrently** (new - to run both servers together)

### Step 2: Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

This installs:
- React 18 & React DOM
- React Router v6
- Vite & @vitejs/plugin-react

### Step 3: Run in Development Mode
```bash
npm run dev
```

This starts:
- ✅ Backend API server on `http://localhost:3002`
- ✅ React dev server on `http://localhost:5173`
- ✅ Vite automatically proxies `/api` requests to backend

Open `http://localhost:5173` in your browser!

---

## 📦 What Changed?

### ✅ Backend (Unchanged Functionality)
- All API endpoints work exactly the same
- `/api/auth/register`, `/api/auth/login`, `/api/auth/users`
- `/api/tasks` (GET, POST, PUT, DELETE)
- JWT authentication middleware unchanged
- MongoDB models unchanged

### 🆕 Frontend (New React App)
- **Replaced**: `public/*.html` files → React SPA
- **Location**: All React code is in `client/` directory
- **Routing**: React Router handles `/login`, `/register`, `/`, `/admin-dashboard`
- **State**: React Context API for authentication
- **Styling**: Modern CSS with gradients and responsive design
- **Build**: Vite for fast dev server and optimized production builds

---

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both backend + frontend (recommended for development) |
| `npm run server` | Run only backend with nodemon |
| `npm run client` | Run only frontend Vite dev server |
| `npm run build` | Build React app for production |
| `npm start` | Run backend in production (serves built React app) |

---

## 🏗️ Project Structure

```
d:\WT\to do list\
├── client/                    # 🆕 React Frontend
│   ├── src/
│   │   ├── components/       # Navbar
│   │   ├── context/          # AuthContext
│   │   ├── pages/            # Login, Register, Home, AdminDashboard
│   │   ├── services/         # API fetch utilities
│   │   ├── App.jsx           # Main app with routes
│   │   ├── main.jsx          # React entry
│   │   └── styles.css        # Global styles
│   ├── index.html
│   ├── vite.config.js        # Vite config with /api proxy
│   └── package.json
├── models/                    # ✅ Unchanged
│   ├── User.js
│   └── Task.js
├── routes/                    # ✅ Unchanged
│   ├── auth.js
│   └── tasks.js
├── middleware/                # ✅ Unchanged
│   └── auth.js
├── server.js                  # ✅ Updated to serve React build
├── package.json               # ✅ Updated with new scripts
└── .env                       # ✅ Same as before
```

---

## 🎯 How It Works

### Development Mode
1. **Backend** runs on port 3002
2. **Frontend** runs on port 5173 (Vite dev server)
3. Vite proxies all `/api/*` requests to `http://localhost:3002`
4. Hot module replacement for instant React updates

### Production Mode
1. `npm run build` creates optimized React build in `client/dist/`
2. `npm start` runs backend which serves the React build
3. All routes go through Express:
   - `/api/*` → API endpoints
   - `*` → React app (client-side routing)

---

## 🧪 Testing the Migration

1. **Start the app**: `npm run dev`
2. **Register**: Go to `http://localhost:5173/register`
3. **Login**: Use your credentials
4. **Create tasks**: Add, complete, delete tasks
5. **Admin**: Visit `/admin-dashboard` to see all users

---

## 🔐 Environment Variables

Make sure your `.env` file exists in the root with:
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=3002
```

---

## 🐛 Troubleshooting

### Port 3002 already in use?
The backend will automatically try the next port (3003, 3004, etc.)

### Can't connect to MongoDB?
Check your `.env` file and MongoDB Atlas connection string

### React app shows blank page?
1. Check browser console for errors
2. Ensure backend is running on port 3002
3. Check that Vite proxy is configured correctly

### API calls failing?
1. Check Network tab in browser DevTools
2. Verify token is being sent in Authorization header
3. Check backend logs for errors

---

## 📝 Next Steps

- ✅ Backend API is fully functional
- ✅ React frontend is wired to all endpoints
- ✅ Authentication flow works (register/login/logout)
- ✅ Task CRUD operations work
- ✅ Admin dashboard shows users

**Ready to develop!** Run `npm run dev` and start coding! 🎉
