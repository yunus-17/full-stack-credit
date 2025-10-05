const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Port endpoint
app.get('/api/port', (req, res) => {
    res.json({ port: global.PORT || PORT });
});

// Serve React app (production build)
const clientBuildPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientBuildPath));

// Catch-all route to serve React app for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Start server with error handling
const startServer = async (port) => {
    // Ensure port is a number
    const portNumber = parseInt(port);
    
    const server = app.listen(portNumber)
        .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${portNumber} is busy, trying ${portNumber + 1}`);
                startServer(portNumber + 1);
            } else {
                console.error('Error starting server:', err);
            }
        })
        .on('listening', () => {
            console.log(`Server is running on port ${portNumber}`);
            // Update the PORT variable to match the actual port being used
            global.PORT = portNumber;
        });
};

startServer(PORT);
