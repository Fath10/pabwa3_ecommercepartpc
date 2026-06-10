import bcrypt from 'bcryptjs'
import pool from '../config/db.js'

const email = process.argv[2]
const newPassword = process.argv[3]

if (!email || !newPassword) {
  console.log('Contoh:')
  console.log('node scripts/resetAdminPassword.js admin11@gmail.com admin11A')
  process.exit(1)
}

try {
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  const result = await pool.query(
    `
    UPDATE users
    SET password = $1,
        role = 'admin'
    WHERE email = $2
    RETURNING user_id, name, email, role
    `,
    [hashedPassword, email]
  )

  if (result.rows.length === 0) {
    console.log('User tidak ditemukan:', email)
  } else {
    console.log('Password berhasil direset dan user dijadikan admin:')
    console.table(result.rows)
  }
} catch (error) {
  console.error('Gagal reset password:', error.message)
} finally {
  await pool.end()
}