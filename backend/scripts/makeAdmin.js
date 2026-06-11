import pool from '../config/db.js'

const email = process.argv[2]

if (!email) {
  console.log('admin11@gmail.com')
  console.log('Contoh: node scripts/makeAdmin.js admin11@gmail.com')
  process.exit(1)
}

try {
  const result = await pool.query(
    `
    UPDATE users
    SET role = 'admin'
    WHERE email = $1
    RETURNING user_id, name, email, role
    `,
    [email]
  )

  if (result.rows.length === 0) {
    console.log('User tidak ditemukan dengan email:', email)
  } else {
    console.log('User berhasil dijadikan admin:')
    console.table(result.rows)
  }
} catch (error) {
  console.error('Gagal update role:', error.message)
} finally {
  await pool.end()
}