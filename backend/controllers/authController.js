import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function makeToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET belum diatur di environment");
  }

  return jwt.sign(
    {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url || null,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
}

function cleanUser(user) {
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar_url: user.avatar_url || null,
    created_at: user.created_at,
  };
}

export const register = async (req, res) => {
  try {
    const { fullname, name, email, password } = req.body;
    const displayName = fullname || name;

    if (!displayName || !email || !password) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password minimal 8 karakter",
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

    const hashedPassword = await bcrypt.hash(password, 10);

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
      [displayName, email, hashedPassword, "user"]
    );

    return res.status(201).json({
      message: "Register berhasil",
      user: cleanUser(result.rows[0]),
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
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
        message: "Email atau password salah",
      });
    }

    const user = result.rows[0];

    if (!user.password) {
      return res.status(401).json({
        message: "Akun ini menggunakan login Google. Silakan masuk dengan Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const token = makeToken(user);

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: cleanUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message:
        error.message === "JWT_SECRET belum diatur di environment"
          ? error.message
          : "Server error",
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

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json({
      user: cleanUser(result.rows[0]),
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, name, password } = req.body;
    const userId = req.user.user_id;

    const userResult = await pool.query(
      `
      SELECT *
      FROM users
      WHERE user_id = $1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const currentUser = userResult.rows[0];
    const updatedName = fullname || name || currentUser.name;

    let finalPassword = currentUser.password;

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          message: "Password minimal 8 karakter",
        });
      }

      finalPassword = await bcrypt.hash(password, 10);
    }

    let avatarUrl = currentUser.avatar_url;

    if (req.file) {
      avatarUrl = `/uploads/products/${req.file.filename}`;
    }

    const updateResult = await pool.query(
      `
      UPDATE users
      SET
        name = $1,
        password = $2,
        avatar_url = $3
      WHERE user_id = $4
      RETURNING
        user_id,
        name,
        email,
        role,
        avatar_url,
        created_at
      `,
      [updatedName, finalPassword, avatarUrl, userId]
    );

    return res.status(200).json({
      message: "Profil berhasil diperbarui",
      user: cleanUser(updateResult.rows[0]),
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email wajib diisi",
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

    if (checkUser.rows.length === 0) {
      return res.status(200).json({
        message: "Jika email terdaftar, link reset telah dikirim.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET belum diatur di environment",
      });
    }

    const user = checkUser.rows[0];

    const resetToken = jwt.sign(
      {
        userId: user.user_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password/${resetToken}`;

    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"e-BuildPC Support" <no-reply@ebuildpc.com>',
      to: email,
      subject: "Reset Password Anda",
      text: `Halo, klik link berikut untuk mereset password Anda: ${resetLink}. Link ini berlaku selama 15 menit.`,
      html: `
        <p>Halo,</p>
        <p>Klik link berikut untuk mereset password Anda:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Link ini berlaku selama 15 menit.</p>
      `,
    });

    console.log("Reset password email dikirim ke:", email);
    console.log("Preview URL Email (Ethereal):", nodemailer.getTestMessageUrl(info));

    return res.status(200).json({
      message: "Jika email terdaftar, link reset telah dikirim. Cek console backend untuk URL Ethereal.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, password } = req.body;
    const finalPassword = newPassword || password;

    if (!token || !finalPassword) {
      return res.status(400).json({
        message: "Token dan password baru wajib diisi",
      });
    }

    if (finalPassword.length < 8) {
      return res.status(400).json({
        message: "Password minimal 8 karakter",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET belum diatur di environment",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({
        message: "Token tidak valid atau sudah kedaluwarsa",
      });
    }

    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    await pool.query(
      `
      UPDATE users
      SET password = $1
      WHERE user_id = $2
      `,
      [hashedPassword, decoded.userId]
    );

    return res.status(200).json({
      message: "Password berhasil diubah. Silakan login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token, credential } = req.body;
    const googleToken = token || credential;

    if (!googleToken) {
      return res.status(400).json({
        message: "Token Google wajib dikirim",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        message: "GOOGLE_CLIENT_ID belum diatur di environment",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const name = payload.name || email.split("@")[0];
    const picture = payload.picture || null;
    const googleId = payload.sub;

    const checkUser = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    let user;

    if (checkUser.rows.length > 0) {
      user = checkUser.rows[0];

      const updateResult = await pool.query(
        `
        UPDATE users
        SET
          google_id = COALESCE(google_id, $1),
          avatar_url = COALESCE(avatar_url, $2)
        WHERE user_id = $3
        RETURNING
          user_id,
          name,
          email,
          role,
          avatar_url,
          created_at
        `,
        [googleId, picture, user.user_id]
      );

      user = updateResult.rows[0];
    } else {
      const result = await pool.query(
        `
        INSERT INTO users
        (
          name,
          email,
          password,
          role,
          avatar_url,
          google_id
        )
        VALUES
        (
          $1,
          $2,
          NULL,
          'user',
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
        [name, email, picture, googleId]
      );

      user = result.rows[0];
    }

    const jwtToken = makeToken(user);

    return res.status(200).json({
      message: "Login Google berhasil",
      token: jwtToken,
      user: cleanUser(user),
    });
  } catch (error) {
    console.error("Google login error:", error);

    return res.status(500).json({
      message: "Gagal autentikasi dengan Google",
    });
  }
};