import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Database path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../data/users.json');

// Read users data
async function readUsers() {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    return [];
  }
}

// Write users data
async function writeUsers(users) {
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2), 'utf-8');
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'Semua kolom input wajib diisi.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Kata sandi minimal harus 8 karakter.' });
    }

    const users = await readUsers();

    // Check existing email
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ message: 'Email sudah terdaftar. Silakan gunakan email lain.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user object
    const newUser = {
      user_id: users.length > 0 ? users[users.length - 1].user_id + 1 : 1,
      name: fullname,
      email: email,
      username: email.split('@')[0],
      password: hashedPassword,
      role: 'user',
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    await writeUsers(users);

    res.status(201).json({
      message: 'Registrasi akun berhasil!',
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Error saat registrasi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan sistem di server.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    const users = await readUsers();

    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login berhasil!',
      token: token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({ message: 'Terjadi kesalahan sistem di server.' });
  }
});

// GET /api/auth/me (Protected)
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

export default router;
