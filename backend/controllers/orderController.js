import pool from "../config/db.js";

export const checkout = async (
  req,
  res
) => {

  const client =
    await pool.connect();

  try {

    const user_id =
      req.user.user_id;

    await client.query(
      "BEGIN"
    );

    const cartResult =
      await client.query(
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

    const cartItems =
      cartResult.rows;

    if (
      cartItems.length === 0
    ) {

      await client.query(
        "ROLLBACK"
      );

      return res.status(400).json({
        message:
          "Keranjang kosong"
      });

    }

    for (
      const item of cartItems
    ) {

      if (
        item.stock <= 0
      ) {

        await client.query(
          "ROLLBACK"
        );

        return res.status(400).json({
          message:
            `${item.product_name} stok habis`
        });

      }

      if (
        item.quantity >
        item.stock
      ) {

        await client.query(
          "ROLLBACK"
        );

        return res.status(400).json({
          message:
            `${item.product_name} melebihi stok yang tersedia`
        });

      }

    }

    const totalAmount =
      cartItems.reduce(
        (
          sum,
          item
        ) =>
          sum +
          (
            Number(item.price) *
            item.quantity
          ),
        0
      );

    const orderResult =
      await client.query(
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
          totalAmount
        ]
      );

    const order =
      orderResult.rows[0];

    for (
      const item of cartItems
    ) {

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
          item.price
        ]
      );

      await client.query(
        `
        UPDATE products
        SET stock =
            stock - $1
        WHERE product_id = $2
        `,
        [
          item.quantity,
          item.product_id
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

    await client.query(
      "COMMIT"
    );

    return res.status(201).json({
      message:
        "Checkout berhasil",

      order: {
        order_id:
          order.order_id,

        total_amount:
          order.total_amount,

        status:
          order.status,

        created_at:
          order.created_at
      }
    });

  } catch (error) {

    await client.query(
      "ROLLBACK"
    );

    console.error(error);

    return res.status(500).json({
      message:
        "Server Error"
    });

  } finally {

    client.release();

  }

};

export const getOrders =
async (req,res) => {

  try {

    const result =
      await pool.query(
        `
        SELECT *
        FROM orders
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [req.user.user_id]
      );

    res.json(
      result.rows
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error"
    });

  }

};

export const getOrderById =
async (req,res) => {

  try {

    const { id } =
      req.params;

    const order =
      await pool.query(
        `
        SELECT *
        FROM orders
        WHERE order_id = $1
        AND user_id = $2
        `,
        [
          id,
          req.user.user_id
        ]
      );

    if (
      order.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Order tidak ditemukan"
      });
    }

    const items =
      await pool.query(
        `
        SELECT
          oi.*,

          p.product_name,

          (
            SELECT image_url
            FROM product_images pi
            WHERE pi.product_id =
                  p.product_id
            LIMIT 1
          ) AS image_url

        FROM order_items oi

        JOIN products p
        ON oi.product_id =
           p.product_id

        WHERE oi.order_id = $1
        `,
        [id]
      );

    res.json({
      order:
        order.rows[0],

      items:
        items.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error"
    });

  }

};