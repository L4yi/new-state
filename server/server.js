import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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

const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/newstate';

// 1. Security Headers (Helmet)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Strict CORS Configuration
const allowedOrigins = [
  'https://newstatehighschool.web.app',
  'https://newstatehighschool.firebaseapp.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl during dev) or allowed origins
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.web.app') || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Cross-Origin Request Blocked by Security Policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Global & Specific Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use(globalLimiter);

// 4. Body Parser with Size Limits to prevent Payload Denial of Service
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Database connection validation middleware
app.use(async (req, res, next) => {
  if (req.path !== '/health' && mongoose.connection.readyState !== 1) {
    console.log('Database connection not active. Re-connecting...');
    try {
      await mongoose.connect(dbUri);
      console.log('Database connection recovered successfully.');
    } catch (err) {
      console.error('Failed to recover database connection:', err.message);
      return res.status(500).json({ error: 'Database connection offline' });
    }
  }
  next();
});

// Routes registration
app.use('/api/portal', portalRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'New State High School Server is Active & Protected' });
});

// Initial database connection
console.log('Connecting to database...');
mongoose.connect(dbUri)
  .then(() => {
    console.log('MongoDB connection established successfully.');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });

// Start listening locally (skip on Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Secured server is running on port ${PORT}`);
  });
}

export default app;
