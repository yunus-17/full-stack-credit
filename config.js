const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'todo_db';

let client = null;
let db = null;

async function connectDB() {
    try {
        if (db) {
            return db;
        }

        if (!client) {
            client = new MongoClient(MONGODB_URI);
            await client.connect();
            console.log('Connected to MongoDB');
        }

        db = client.db(DB_NAME);
        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

module.exports = { connectDB }; 