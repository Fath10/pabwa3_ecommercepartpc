import pool from "../config/db.js";
import {
  deleteFile,
  moveFile
} from "../utils/fileHelper.js";

export const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
      p.*,
      c.product_name
      FROM products p
      JOIN categories c
      ON p.category_id = c.category_id
      ORDER BY p.product_id DESC
      WHERE p.is_active = TRUE
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getProductById = async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT *
      FROM products
      WHERE product_id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

export const createProduct = async (
  req,
  res
) => {

  try {

    const {
      category_id,
      product_name,
      description,
      price,
      stock
    } = req.body;

    // Required Field
    if (
      !category_id ||
      !product_name ||
      !price
    ) {
      await deleteFile(req.file?.path);
      return res.status(400).json({
        message: "Kategori, nama produk dan harga wajib diisi"
      });
    }

    // Price Validation
    if (Number(price) <= 0) {
      await deleteFile(req.file?.path);
      return res.status(400).json({
        message: "Harga harus lebih dari 0"
      });
    }

    // Stock Validation
    if (stock < 0) {
      await deleteFile(req.file?.path);
      return res.status(400).json({
        message: "Stock tidak boleh negatif"
      });
    }

    // Category Exists
    const category = await pool.query(
      `
      SELECT *
      FROM categories
      WHERE category_id = $1
      `,
      [category_id]
    );

    if (category.rows.length === 0) {
      await deleteFile(req.file?.path);
      return res.status(404).json({
        message: "Kategori tidak ditemukan"
      });
    }

    // Duplicate Product
    const duplicate = await pool.query(
      `
      SELECT *
      FROM products
      WHERE LOWER(product_name) = LOWER($1)
      `,
      [product_name]
    );

    if (duplicate.rows.length > 0) {
      await deleteFile(req.file?.path);
      return res.status(409).json({
        message: "Nama produk sudah digunakan"
      });
    }

    let image_url = null;
    let finalImagePath = null;

    if (req.file) {

      image_url =
        await moveFile(
          req.file.path,
          req.file.filename
        );

        finalImagePath = `/uploads/products/${req.file.filename}`;

    }

    const result = await pool.query(
      `
      INSERT INTO products
      (
        category_id,
        product_name,
        description,
        price,
        stock,
        image_url
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        category_id,
        product_name,
        description,
        price,
        stock,
        image_url
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    await deleteFile(req.file?.path);

    await deleteFile(finalImagePath);

    res.status(500).json({
      message: "Gagal menambah produk",
    });

  }
};

export const updateProduct = async (
  req,
  res
) => {

  try {

    const {
      category_id,
      product_name,
      description,
      price,
      stock
    } = req.body;

    const existingProduct =
      await pool.query(
        `
        SELECT *
        FROM products
        WHERE product_id = $1
        `,
        [req.params.id]
      );

    if (
      existingProduct.rows.length === 0
    ) {
      return res.status(404).json({
        message: "Produk tidak ditemukan"
      });
    }

    const duplicate =
      await pool.query(
        `
        SELECT *
        FROM products
        WHERE LOWER(product_name)=LOWER($1)
        AND product_id <> $2
        `,
        [
          product_name,
          req.params.id
        ]
      );

    if (
      duplicate.rows.length > 0
    ) {
      return res.status(409).json({
        message:
          "Nama produk sudah digunakan"
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        message:
          "Harga harus lebih dari 0"
      });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({
        message:
          "Stock tidak boleh negatif"
      });
    }

    const result =
      await pool.query(
        `
        UPDATE products
        SET
        category_id = $1,
        product_name = $2,
        description = $3,
        price = $4,
        stock = $5
        WHERE product_id = $6
        RETURNING *
        `,
        [
          category_id,
          product_name,
          description,
          price,
          stock,
          req.params.id
        ]
      );

    res.json({
      message:
        "Produk berhasil diupdate",
      product:
        result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

export const deleteProduct = async (
  req,
  res
) => {

  try {

    const result =
      await pool.query(
        `
        UPDATE products
        SET is_active = FALSE
        WHERE product_id = $1
        RETURNING *
        `,
        [req.params.id]
      );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Produk tidak ditemukan"
      });
    }

    res.json({
      message:
        "Produk berhasil dinonaktifkan"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error"
    });

  }
};