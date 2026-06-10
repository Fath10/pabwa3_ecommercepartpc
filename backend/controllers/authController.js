import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
<<<<<<< HEAD
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
=======
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFilePath = path.join(__dirname, "../data/users.json");

async function readUsers() {
  try {
    const data = await fs.readFile(usersFilePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
      await fs.writeFile(usersFilePath, "[]");
      return [];
    }

    throw error;
  }
}

async function writeUsers(users) {
  await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

function createSafeUser(user) {
  return {
    user_id: user.user_id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role || "user",
  };
}

function createToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role || "user",
    },
    process.env.JWT_SECRET || "ebuildpc_secret_key",
    {
      expiresIn: "24h",
    }
  );
}

export const register = async (req, res) => {
  try {
    const { fullname, name, username, email, password } = req.body;

    const finalName = fullname || name || username;

    if (!finalName || !email || !password) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter",
      });
    }

    const users = await readUsers();

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
>>>>>>> 30e37d261b6ccb96412709784af17465c862dd27
      return res.status(409).json({
        message: "Email sudah digunakan",
      });
    }

<<<<<<< HEAD
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
=======
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      user_id: users.length
        ? Math.max(...users.map((user) => Number(user.user_id) || 0)) + 1
        : 1,
      name: finalName,
      username: username || email.split("@")[0],
      email,
      password: hashedPassword,
      role: "user",
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    await writeUsers(users);

    return res.status(201).json({
      message: "Register berhasil",
      user: createSafeUser(newUser),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
>>>>>>> 30e37d261b6ccb96412709784af17465c862dd27
    });
  }
};

export const login = async (req, res) => {
<<<<<<< HEAD
try {
    const {
      email,
      password,
    } = req.body;

    if (
      !email ||
      !password
    ) {``
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
=======
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const users = await readUsers();

    const user = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const token = createToken(user);
>>>>>>> 30e37d261b6ccb96412709784af17465c862dd27

    return res.status(200).json({
      message: "Login berhasil",
      token,
<<<<<<< HEAD
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
=======
      user: createSafeUser(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
>>>>>>> 30e37d261b6ccb96412709784af17465c862dd27
    });
  }
};

export const getMe = async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
>>>>>>> 30e37d261b6ccb96412709784af17465c862dd27
};