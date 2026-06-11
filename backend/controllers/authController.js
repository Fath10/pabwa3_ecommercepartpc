import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  try {
    const { 
        fullname, 
        email, 
        password 
    } = req.body;

    if (
        !fullname || 
        !email || 
        !password
    ) {
      return res.status(400).json({
        message: "Semua field wajib diisi"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password minimal 8 karakter"
      });
    }

const checkUser = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email sudah digunakan",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password,
        role
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      RETURNING
      user_id,
      name,
      email,
      role,
      avatar_url,
      created_at
      `,
      [
        fullname,
        email,
        hashedPassword,
        "user",
      ]
    );

    return res.status(201).json({
      message: "Register berhasil",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
try {
    const {
      email,
      password,
    } = req.body;

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Email dan password wajib diisi",
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message:
          "Email atau password salah",
      });
    }

    const user = result.rows[0];

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        message:
          "Email atau password salah",
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMe = async (req, res) => {
  try {
      const result = await pool.query(
        `
        SELECT
          user_id,
          name,
          email,
          role,
          avatar_url,
          created_at
        FROM users
        WHERE user_id = $1
        `,
        [req.user.user_id]
      );

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "User tidak ditemukan",
        });
      }

      return res.status(200).json({
        user: result.rows[0],
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Server error",
      });
    }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, password } = req.body;
    const userId = req.user.user_id;

    // Check if user exists
    const userResult = await pool.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const currentUser = userResult.rows[0];
    const updatedName = fullname || currentUser.name;
    
    // Process password if provided
    let finalPassword = currentUser.password;
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ message: "Password minimal 8 karakter" });
      }
      finalPassword = await bcrypt.hash(password, 10);
    }

    // Process avatar upload
    let avatarUrl = currentUser.avatar_url;
    if (req.file) {
      // Multer stores this file in uploads/products
      avatarUrl = `/uploads/products/${req.file.filename}`;
    }

    const updateResult = await pool.query(
      `
      UPDATE users 
      SET name = $1, password = $2, avatar_url = $3
      WHERE user_id = $4
      RETURNING user_id, name, email, role, avatar_url, created_at
      `,
      [updatedName, finalPassword, avatarUrl, userId]
    );

    return res.status(200).json({
      message: "Profil berhasil diperbarui",
      user: updateResult.rows[0],
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    const checkUser = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (checkUser.rows.length === 0) {
      // Don't reveal if user exists or not for security, just say check email
      return res.status(200).json({ message: "Jika email terdaftar, link reset telah dikirim." });
    }

    const user = checkUser.rows[0];
    const resetToken = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '15m' }
    );

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password/${resetToken}`;

    // Generate Ethereal test account for dev
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: '"e-BuildPC Support" <no-reply@ebuildpc.com>',
      to: email,
      subject: "Reset Password Anda",
      text: `Halo, klik link berikut untuk mereset password Anda: ${resetLink}. Link ini berlaku selama 15 menit.`,
      html: `<p>Halo,</p><p>Klik link berikut untuk mereset password Anda:</p><p><a href="${resetLink}">${resetLink}</a></p><p>Link ini berlaku selama 15 menit.</p>`,
    });

    console.log("Reset password email dikirim ke:", email);
    console.log("Preview URL Email (Ethereal):", nodemailer.getTestMessageUrl(info));

    return res.status(200).json({ message: "Jika email terdaftar, link reset telah dikirim. (Cek console backend untuk URL Ethereal)" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token dan password baru wajib diisi" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password minimal 8 karakter" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    } catch (err) {
      return res.status(400).json({ message: "Token tidak valid atau sudah kadaluarsa" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users SET password = $1 WHERE user_id = $2`,
      [hashedPassword, decoded.userId]
    );

    return res.status(200).json({ message: "Password berhasil diubah. Silakan login." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token Google wajib dikirim" });
    }

    // Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    const checkUser = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    let user;

    if (checkUser.rows.length > 0) {
      // User exists, just update their google_id and auth_provider if they were local before
      user = checkUser.rows[0];
      if (user.auth_provider === 'local') {
        await pool.query(
          `UPDATE users SET auth_provider = 'google', google_id = $1 WHERE email = $2`,
          [googleId, email]
        );
      }
    } else {
      // Create new user (auto-register)
      const result = await pool.query(
        `
        INSERT INTO users (name, email, role, avatar_url, auth_provider, google_id)
        VALUES ($1, $2, 'user', $3, 'google', $4)
        RETURNING user_id, name, email, role, avatar_url, created_at
        `,
        [name, email, picture, googleId]
      );
      user = result.rows[0];
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url || picture,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login Google berhasil",
      token: jwtToken,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url || picture,
      },
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(500).json({ message: "Gagal autentikasi dengan Google" });
  }
};