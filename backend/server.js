import app from './src/app.js';
import { config } from './src/config/config.js';
import { connectDB } from './src/config/db.js';

const startServer = async () => {
  // Try connecting to MongoDB or activate in-memory fallback
  await connectDB();

  const PORT = config.port || 5000;
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 VELOOP Giveaway Backend Server running on port ${PORT}`);
    console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
    console.log(`🔒 Security: Helmet, Strict Rate Limiting, Idempotency Active`);
    console.log(`🛡️  Fraud Detection Layer: Armed and Monitoring`);
    console.log(`====================================================`);
  });
};

startServer();
