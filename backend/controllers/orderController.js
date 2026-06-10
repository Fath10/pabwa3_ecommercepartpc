import pool from "../config/db.js";

export const checkout = async (req, res) => {
  const client = await pool.connect();

  try {
    const user_id = req.user.user_id;

    await client.query("BEGIN");

    const cartResult = await client.query(
      `
      SELECT
        c.cart_id,
        c.quantity,

        p.product_id,
        p.product_name,
        p.price,
        p.stock

      FROM carts c

      JOIN products p
      ON c.product_id = p.product_id

      WHERE c.user_id = $1
      `,
      [user_id]
    );

    const cartItems = cartResult.rows;

    if (cartItems.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Keranjang kosong",
      });
    }

    for (const item of cartItems) {
      if (item.stock <= 0) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          message: `${item.product_name} stok habis`,
        });
      }

      if (item.quantity > item.stock) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          message: `${item.product_name} melebihi stok yang tersedia`,
        });
      }
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const orderResult = await client.query(
      `
      INSERT INTO orders
      (
        user_id,
        total_amount,
        status
      )
      VALUES
      (
        $1,
        $2,
        'pending'
      )
      RETURNING *
      `,
      [
        user_id,
        totalAmount,
      ]
    );

    const order = orderResult.rows[0];

    for (const item of cartItems) {
      await client.query(
        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          quantity,
          price
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4
        )
        `,
        [
          order.order_id,
          item.product_id,
          item.quantity,
          item.price,
        ]
      );

      await client.query(
        `
        UPDATE products
        SET stock = stock - $1
        WHERE product_id = $2
        `,
        [
          item.quantity,
          item.product_id,
        ]
      );
    }

    await client.query(
      `
      DELETE FROM carts
      WHERE user_id = $1
      `,
      [user_id]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Checkout berhasil",
      order: {
        order_id: order.order_id,
        user_id: order.user_id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  } finally {
    client.release();
  }
};

export const getOrders = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";

    const query = isAdmin
      ? `
        SELECT
          o.order_id,
          o.user_id,
          o.total_amount,
          o.status,
          o.shipping_receipt,
          o.created_at,
          o.shipped_at,
          o.delivered_at,

          u.name AS customer_name,
          u.email AS customer_email,

          COALESCE(
            json_agg(
              json_build_object(
                'order_item_id', oi.order_item_id,
                'product_id', p.product_id,
                'product_name', p.product_name,
                'quantity', oi.quantity,
                'price', oi.price,
                'image_url',
                  (
                    SELECT pi.image_url
                    FROM product_images pi
                    WHERE pi.product_id = p.product_id
                    LIMIT 1
                  )
              )
            ) FILTER (WHERE oi.order_item_id IS NOT NULL),
            '[]'
          ) AS items

        FROM orders o

        LEFT JOIN users u
        ON o.user_id = u.user_id

        LEFT JOIN order_items oi
        ON o.order_id = oi.order_id

        LEFT JOIN products p
        ON oi.product_id = p.product_id

        GROUP BY
          o.order_id,
          o.user_id,
          o.total_amount,
          o.status,
          o.shipping_receipt,
          o.created_at,
          o.shipped_at,
          o.delivered_at,
          u.name,
          u.email

        ORDER BY o.created_at DESC
        `
      : `
        SELECT
          o.order_id,
          o.user_id,
          o.total_amount,
          o.status,
          o.shipping_receipt,
          o.created_at,
          o.shipped_at,
          o.delivered_at,

          u.name AS customer_name,
          u.email AS customer_email,

          COALESCE(
            json_agg(
              json_build_object(
                'order_item_id', oi.order_item_id,
                'product_id', p.product_id,
                'product_name', p.product_name,
                'quantity', oi.quantity,
                'price', oi.price,
                'image_url',
                  (
                    SELECT pi.image_url
                    FROM product_images pi
                    WHERE pi.product_id = p.product_id
                    LIMIT 1
                  )
              )
            ) FILTER (WHERE oi.order_item_id IS NOT NULL),
            '[]'
          ) AS items

        FROM orders o

        LEFT JOIN users u
        ON o.user_id = u.user_id

        LEFT JOIN order_items oi
        ON o.order_id = oi.order_id

        LEFT JOIN products p
        ON oi.product_id = p.product_id

        WHERE o.user_id = $1

        GROUP BY
          o.order_id,
          o.user_id,
          o.total_amount,
          o.status,
          o.shipping_receipt,
          o.created_at,
          o.shipped_at,
          o.delivered_at,
          u.name,
          u.email

        ORDER BY o.created_at DESC
        `;

    const values = isAdmin
      ? []
      : [req.user.user_id];

    const result = await pool.query(
      query,
      values
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === "admin";

    const orderQuery = isAdmin
      ? `
        SELECT
          o.*,
          u.name AS customer_name,
          u.email AS customer_email
        FROM orders o
        LEFT JOIN users u
        ON o.user_id = u.user_id
        WHERE o.order_id = $1
        `
      : `
        SELECT
          o.*,
          u.name AS customer_name,
          u.email AS customer_email
        FROM orders o
        LEFT JOIN users u
        ON o.user_id = u.user_id
        WHERE o.order_id = $1
        AND o.user_id = $2
        `;

    const orderValues = isAdmin
      ? [id]
      : [id, req.user.user_id];

    const order = await pool.query(
      orderQuery,
      orderValues
    );

    if (order.rows.length === 0) {
      return res.status(404).json({
        message: "Order tidak ditemukan",
      });
    }

    const items = await pool.query(
      `
      SELECT
        oi.*,
        p.product_name,

        (
          SELECT image_url
          FROM product_images pi
          WHERE pi.product_id = p.product_id
          LIMIT 1
        ) AS image_url

      FROM order_items oi

      JOIN products p
      ON oi.product_id = p.product_id

      WHERE oi.order_id = $1
      `,
      [id]
    );

    return res.json({
      order: order.rows[0],
      items: items.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const processOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE orders
      SET status = 'processing'
      WHERE order_id = $1
      AND status = 'pending'
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order tidak ditemukan atau status tidak valid",
      });
    }

    return res.json({
      message: "Order berhasil diproses",
      order: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const shipOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { shipping_receipt } = req.body;

    if (!shipping_receipt) {
      return res.status(400).json({
        message: "Nomor resi wajib diisi",
      });
    }

    const result = await pool.query(
      `
      UPDATE orders
      SET
        status = 'shipped',
        shipping_receipt = $1,
        shipped_at = NOW()
      WHERE order_id = $2
      AND status = 'processing'
      RETURNING *
      `,
      [
        shipping_receipt,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order tidak ditemukan atau status tidak valid",
      });
    }

    return res.json({
      message: "Pesanan berhasil dikirim",
      order: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const deliverOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await pool.query(
      `
      SELECT *
      FROM orders
      WHERE order_id = $1
      `,
      [id]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({
        message: "Order tidak ditemukan",
      });
    }

    const currentOrder = order.rows[0];

    if (
      req.user.role !== "admin" &&
      Number(currentOrder.user_id) !== Number(req.user.user_id)
    ) {
      return res.status(403).json({
        message: "Akses ditolak",
      });
    }

    if (currentOrder.status !== "shipped") {
      return res.status(400).json({
        message: "Order belum dikirim",
      });
    }

    const result = await pool.query(
      `
      UPDATE orders
      SET
        status = 'delivered',
        delivered_at = NOW()
      WHERE order_id = $1
      RETURNING *
      `,
      [id]
    );

    return res.json({
      message: "Order berhasil diselesaikan",
      order: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};