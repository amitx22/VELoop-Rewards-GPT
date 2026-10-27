import mongoose from 'mongoose';
import { config } from './config.js';

let isMongooseConnected = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2000, // Quick timeout if no local MongoDB service
    });
    isMongooseConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    isMongooseConnected = false;
    console.warn(`[Database] Local MongoDB server not reachable (${err.message}).`);
    console.log(`[Database] Seamlessly operating with transactional In-Memory / Hybrid Engine.`);
  }
};

export const getIsMongooseConnected = () => isMongooseConnected;
