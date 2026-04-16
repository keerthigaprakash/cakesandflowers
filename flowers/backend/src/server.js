/**
 * server.js
 * ─────────
 * Entry point – loads env vars, initialises the database, and starts
 * the Express server.
 */

require('dotenv').config();

const app = require('./app');
const { initDB } = require('./config/db');

const PORT = parseInt(process.env.PORT, 10) || 5000;

const start = async () => {
  try {
    // Create tables if they don't exist yet
    await initDB();

    app.listen(PORT, () => {
      console.log(`\n🌸 Bloom & Bliss API server running on http://localhost:${PORT}`);
      console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
