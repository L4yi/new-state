import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import portalRoutes from './routes/portalRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes registration
app.use('/api/portal', portalRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'New State High School Server is Active' });
});

// Database connection
const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/newstate';
console.log('Connecting to database...');

mongoose.connect(dbUri)
  .then(() => {
    console.log('MongoDB connection established successfully.');
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    console.log('Ensure MongoDB is installed and running locally on your system.');
  });
