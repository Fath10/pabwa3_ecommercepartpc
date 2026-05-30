import pool from "../config/db.js";

export const getCart = async (
  req,
  res
) => {

  const user_id = req.user.user_id;

  const result = await pool.query(
    `
    SELECT
    c.cart_id,
    p.product_name,
    p.price,
    p.image_url,
    c.quantity
    FROM carts c
    JOIN products p
    ON c.product_id = p.product_id
    WHERE c.user_id = $1
    `,
    [user_id]
  );

  res.json(result.rows);
};

export const addToCart = async (
  req,
  res
) => {

  const user_id = req.user.user_id;

  const {
    product_id,
    quantity
  } = req.body;

  await pool.query(
    `
    INSERT INTO carts
    (
      user_id,
      product_id,
      quantity
    )
    VALUES
    ($1,$2,$3)
    `,
    [
      user_id,
      product_id,
      quantity
    ]
  );

  res.json({
    message: "Produk ditambahkan",
  });
};