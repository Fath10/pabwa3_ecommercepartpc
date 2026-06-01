import pool from "../config/db.js";

export const getCart = async (
  req,
  res
) => {

  try {

    const user_id = req.user.user_id;

    const result = await pool.query(
      `
      SELECT
      c.cart_id,
      c.quantity,

      p.product_id,
      p.product_name,
      p.price,
      p.stock,
      (
        p.price * c.quantity
      ) AS subtotal,

      (
        SELECT image_url
        FROM product_images pi
        WHERE pi.product_id = p.product_id
        LIMIT 1
      ) AS image_url,

      CASE
        WHEN p.stock = 0 THEN TRUE
        ELSE FALSE
      END AS out_of_stock,

      CASE
        WHEN c.quantity > p.stock THEN TRUE
        ELSE FALSE
      END AS exceeds_stock

    FROM carts c
    JOIN products p
    ON c.product_id = p.product_id

    WHERE c.user_id = $1
      `,
      [user_id]
    );

    const items = result.rows;

    const totalItems =
      items.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      );

    

    const totalPrice =
      items.reduce(
        (sum, item) =>
          sum + Number(item.subtotal),
        0
      );
    const taxPercentage = 0.1; // 10% tax
    const totalTax = totalPrice * taxPercentage;
    const grandTotal = totalPrice + totalTax;

    res.json({
      items,
      totalItems,
      totalPrice,
      totalTax,
      grandTotal
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const addToCart = async (
  req,
  res
) => {

  try {

    const { product_id } = req.body;

    const user_id =
      req.user.user_id;

    if (!product_id) {
      return res.status(400).json({
        message: "Product ID wajib diisi"
      });
    }

    // cek produk
    const product =
      await pool.query(
        `
        SELECT
          product_id,
          product_name,
          stock
        FROM products
        WHERE product_id = $1
        `,
        [product_id]
      );

    if (
      product.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Produk tidak ditemukan"
      });
    }

    const currentProduct =
      product.rows[0];

    // stok habis
    if (
      currentProduct.stock <= 0
    ) {
      return res.status(400).json({
        message:
          "Stok produk habis"
      });
    }

    // cek sudah ada di cart atau belum
    const existing =
      await pool.query(
        `
        SELECT *
        FROM carts
        WHERE user_id = $1
        AND product_id = $2
        `,
        [
          user_id,
          product_id
        ]
      );

    // produk sudah ada di cart
    if (
      existing.rows.length > 0
    ) {

      const currentCart =
        existing.rows[0];

      // quantity sudah mencapai stok
      if (
        currentCart.quantity >=
        currentProduct.stock
      ) {
        return res.status(400).json({
          message:
            "Jumlah produk di keranjang melebihi stok"
        });
      }

      const result =
        await pool.query(
          `
          UPDATE carts
          SET quantity = quantity + 1
          WHERE user_id = $1
          AND product_id = $2
          RETURNING *
          `,
          [
            user_id,
            product_id
          ]
        );

      return res.status(200).json({
        message:
          "Jumlah produk ditambah",
        cart:
          result.rows[0]
      });

    }

    // produk belum ada di cart
    const result =
      await pool.query(
        `
        INSERT INTO carts
        (
          user_id,
          product_id,
          quantity
        )
        VALUES
        ($1,$2,1)
        RETURNING *
        `,
        [
          user_id,
          product_id
        ]
      );

    res.status(201).json({
      message:
        "Produk ditambahkan ke keranjang",
      cart:
        result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error"
    });
  }
};

export const increaseQuantity = async (
  req,
  res
  ) => {

  try {

    const { id } = req.params;

    const user_id =
      req.user.user_id;


    const current = await pool.query(
      `
      SELECT 
        c.quantity,
        p.stock
      FROM carts c
      JOIN products p ON c.product_id = p.product_id
      WHERE c.cart_id = $1
      AND c.user_id = $2
      `,
      [id, user_id]
    );
    if(current.rows.length === 0) {
      return res.status(404).json({
        message: "Item tidak ditemukan"
      });
    }

    const { quantity, stock } = current.rows[0];
    if(quantity >= stock) {
      return res.status(400).json({
        message: "Jumlah produk sudah mencapai batas stok"
      });
    }

    const result =
      await pool.query(
        `
        UPDATE carts
        SET quantity = quantity + 1
        WHERE cart_id = $1
        AND user_id = $2
        RETURNING *
        `,
        [id, user_id]
      );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

};

export const decreaseQuantity = async (req, res) => {

  const { id } = req.params;

  const current =
    await pool.query(
      `
      SELECT *
      FROM carts
      WHERE cart_id = $1
      AND user_id = $2
      `,
      [id, req.user.user_id]
    );

  if (
    current.rows.length === 0
  ) {
    return res.status(404).json({
      message: "Item tidak ditemukan"
    });
  }

  const item =
    current.rows[0];

  if (item.quantity === 1) {

    await pool.query(
      `
      DELETE FROM carts
      WHERE cart_id = $1
      AND user_id = $2
      `,
      [id, req.user.user_id]
    );

    return res.json({
      deleted: true
    });
  }

  const result =
    await pool.query(
      `
      UPDATE carts
      SET quantity = quantity - 1
      WHERE cart_id = $1
      AND user_id = $2
      RETURNING *
      `,
      [id, req.user.user_id]
    );

  res.json(result.rows[0]);
};


export const removeFromCart =
async (req,res) => {

  try {

    const { id } = req.params;

    const user_id =
      req.user.user_id;

    const result =
      await pool.query(
        `
        DELETE FROM carts
        WHERE cart_id = $1
        AND user_id = $2
        RETURNING *
        `,
        [id, user_id]
      );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Item tidak ditemukan"
        });
    }

    res.json({
      message:
        "Produk dihapus"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error"
    });

  }

};