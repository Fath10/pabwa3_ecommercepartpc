import pool from "../config/db.js";

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_chat_threads (
      thread_id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(product_id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS admin_chat_messages (
      message_id SERIAL PRIMARY KEY,
      thread_id INTEGER NOT NULL REFERENCES admin_chat_threads(thread_id) ON DELETE CASCADE,
      sender_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      sender_role VARCHAR(20) NOT NULL,
      message TEXT NOT NULL,
      read_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_admin_chat_messages_thread
      ON admin_chat_messages(thread_id, created_at);
  `);

  schemaReady = true;
}

const threadSelect = `
  SELECT
    t.thread_id,
    t.user_id,
    t.product_id,
    t.created_at,
    t.updated_at,
    u.name AS customer_name,
    u.email AS customer_email,
    p.product_name,
    COALESCE(
      (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.product_id LIMIT 1),
      NULL
    ) AS product_image,
    (SELECT m.message FROM admin_chat_messages m WHERE m.thread_id = t.thread_id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
    (SELECT m.created_at FROM admin_chat_messages m WHERE m.thread_id = t.thread_id ORDER BY m.created_at DESC LIMIT 1) AS last_message_at
  FROM admin_chat_threads t
  JOIN users u ON u.user_id = t.user_id
  LEFT JOIN products p ON p.product_id = t.product_id
`;

async function findAllowedThread(threadId, user) {
  const params = [threadId];
  let where = "t.thread_id = $1";

  if (user.role !== "admin") {
    params.push(user.user_id);
    where += " AND t.user_id = $2";
  }

  return pool.query(`${threadSelect} WHERE ${where}`, params);
}

export const listThreads = async (req, res) => {
  try {
    await ensureSchema();

    const params = [];
    let where = "";

    if (req.user.role !== "admin") {
      params.push(req.user.user_id);
      where = "WHERE t.user_id = $1";
    }

    const result = await pool.query(
      `${threadSelect} ${where} ORDER BY COALESCE(
        (SELECT MAX(m.created_at) FROM admin_chat_messages m WHERE m.thread_id = t.thread_id),
        t.updated_at
      ) DESC`,
      params
    );

    res.json(result.rows);
  } catch (error) {
    console.error("List admin chats:", error);
    res.status(500).json({ message: "Gagal memuat riwayat chat" });
  }
};

export const createThread = async (req, res) => {
  try {
    await ensureSchema();

    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admin tidak dapat membuat chat produk" });
    }

    const productId = Number(req.body.product_id);
    if (!productId) {
      return res.status(400).json({ message: "Produk wajib dipilih" });
    }

    const result = await pool.query(
      `INSERT INTO admin_chat_threads (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET updated_at = NOW()
       RETURNING thread_id`,
      [req.user.user_id, productId]
    );

    const thread = await findAllowedThread(result.rows[0].thread_id, req.user);
    res.status(201).json(thread.rows[0]);
  } catch (error) {
    console.error("Create admin chat:", error);
    res.status(500).json({ message: "Gagal membuka chat admin" });
  }
};

export const getMessages = async (req, res) => {
  try {
    await ensureSchema();
    const thread = await findAllowedThread(req.params.id, req.user);

    if (!thread.rows.length) {
      return res.status(404).json({ message: "Percakapan tidak ditemukan" });
    }

    await pool.query(
      `UPDATE admin_chat_messages
       SET read_at = NOW()
       WHERE thread_id = $1 AND sender_role <> $2 AND read_at IS NULL`,
      [req.params.id, req.user.role]
    );

    const messages = await pool.query(
      `SELECT message_id, thread_id, sender_id, sender_role, message, read_at, created_at
       FROM admin_chat_messages
       WHERE thread_id = $1
       ORDER BY created_at ASC`,
      [req.params.id]
    );

    res.json({ thread: thread.rows[0], messages: messages.rows });
  } catch (error) {
    console.error("Get admin chat:", error);
    res.status(500).json({ message: "Gagal memuat pesan" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    await ensureSchema();
    const message = String(req.body.message || "").trim();

    if (!message) {
      return res.status(400).json({ message: "Pesan tidak boleh kosong" });
    }

    const thread = await findAllowedThread(req.params.id, req.user);
    if (!thread.rows.length) {
      return res.status(404).json({ message: "Percakapan tidak ditemukan" });
    }

    const result = await pool.query(
      `INSERT INTO admin_chat_messages (thread_id, sender_id, sender_role, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.params.id, req.user.user_id, req.user.role, message]
    );

    await pool.query(
      "UPDATE admin_chat_threads SET updated_at = NOW() WHERE thread_id = $1",
      [req.params.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Send admin chat:", error);
    res.status(500).json({ message: "Gagal mengirim pesan" });
  }
};

export const deleteThread = async (req, res) => {
  try {
    await ensureSchema();
    const thread = await findAllowedThread(req.params.id, req.user);

    if (!thread.rows.length) {
      return res.status(404).json({ message: "Percakapan tidak ditemukan" });
    }

    await pool.query("DELETE FROM admin_chat_threads WHERE thread_id = $1", [req.params.id]);
    res.json({ message: "Riwayat chat berhasil dihapus" });
  } catch (error) {
    console.error("Delete admin chat:", error);
    res.status(500).json({ message: "Gagal menghapus riwayat chat" });
  }
};
