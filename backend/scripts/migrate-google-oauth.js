import pool from '../config/db.js';

const migrateGoogleOAuth = async () => {
  try {
    console.log("Menjalankan migrasi database untuk Google OAuth...");
    
    // Menambahkan kolom auth_provider jika belum ada, default ke 'local'
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'local'");
    
    // Menambahkan kolom google_id jika belum ada
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255)");
    
    // Update password column to allow NULL if auth_provider is google
    await pool.query("ALTER TABLE users ALTER COLUMN password DROP NOT NULL");

    console.log("Migrasi selesai: Kolom auth_provider dan google_id berhasil ditambahkan/dicek.");
  } catch (error) {
    console.error("Terjadi kesalahan saat migrasi:", error);
  } finally {
    pool.end();
  }
};

migrateGoogleOAuth();
