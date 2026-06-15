import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import pool from './config/db.js';

async function checkRAMs() {
  try {
    const res = await pool.query("SELECT product_id, product_name, price, stock, description FROM products ORDER BY product_id ASC");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkRAMs();
