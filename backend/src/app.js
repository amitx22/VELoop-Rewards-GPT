import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiLimiter } from './middleware/rateLimitMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import giveawayRoutes from './routes/giveawayRoutes.js';
import participationRoutes from './routes/participationRoutes.js';
import winnerRoutes from './routes/winnerRoutes.js';
import claimRoutes from './routes/claimRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { config } from './config/config.js';

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration (Page 73: Never use cors(*) without understanding implications)
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during local development testing
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-idempotency-key'],
  })
);

// Payload limit
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Global Rate Limiter
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'VELOOP Rewards Giveaway Engine',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/giveaways', giveawayRoutes);
app.use('/api/giveaways', participationRoutes);
app.use('/api/giveaways', winnerRoutes);
app.use('/api/giveaways', claimRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    errorCode: 'ROUTE_NOT_FOUND',
    message: `Endpoint ${req.originalUrl} does not exist on VELOOP Giveaway API.`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
