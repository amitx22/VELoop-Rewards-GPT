import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/veloop_giveaway',
  jwtSecret: process.env.JWT_SECRET || 'veloop_super_secure_jwt_secret_key_2026_giveaway_auth',
  refreshSecret: process.env.REFRESH_SECRET || 'veloop_super_secure_refresh_secret_key_2026',
  deviceSalt: process.env.DEVICE_SALT || 'veloop_fraud_protection_salt_998877',
};
