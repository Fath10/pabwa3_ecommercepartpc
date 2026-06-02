import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

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