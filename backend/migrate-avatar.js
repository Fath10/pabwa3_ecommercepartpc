import dotenv from 'dotenv';
dotenv.config();
import pool from './config/db.js';

async function migrate() {
  try {
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255)");
    console.log("Migration successful");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}
migrate();
