import dotenv from 'dotenv';
dotenv.config();
import pool from './config/db.js';

async function check() {
  try {
    const res = await pool.query(`
      SELECT p.product_id, p.product_name, pi.image_url 
      FROM products p 
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
    `);
    console.log("Products & Images list:", res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
check();
