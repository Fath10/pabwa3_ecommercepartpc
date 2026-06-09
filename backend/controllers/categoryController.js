import pool from "../config/db.js";



export const getCategories = async (
  req,
  res
) => {

  try {

    const result = await pool.query(
      `
      SELECT *
      FROM categories
      ORDER BY category_id ASC
      `
    );

    res.status(200).json({
      message: "Category retrieved successfully",
      data: result.rows
    });
  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

export const getCategoryById = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM categories
      WHERE category_id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan"
      });
    }

    res.status(200).json(
      result.rows[0]
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

export const createCategory = async (
  req,
  res
) => {

  try {

    const { category_name } = req.body;

    if (!category_name || !category_name.trim()) {
      return res.status(400).json({
        message: "Nama kategori wajib diisi"
      });
    }

    const duplicate = await pool.query(
      `
      SELECT *
      FROM categories
      WHERE LOWER(category_name) = LOWER($1)
      `,
      [category_name]
    );

    if (duplicate.rows.length > 0) {
      return res.status(409).json({
        message: "Nama kategori sudah digunakan"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO categories
      (
        category_name
      )
      VALUES
      ($1)
      RETURNING *
      `,
      [category_name]
    );

    res.status(201).json({
      message: "Kategori berhasil dibuat",
      data: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

export const updateCategory = async (
  req,
  res
) => {

  try {

    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name || !category_name.trim()) {
      return res.status(400).json({
        message: "Nama kategori wajib diisi"
      });
    }

    const category = await pool.query(
      `
      SELECT *
      FROM categories
      WHERE category_id = $1
      `,
      [id]
    );

    if (category.rows.length === 0) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan"
      });
    }

    const duplicate = await pool.query(
      `
      SELECT *
      FROM categories
      WHERE LOWER(category_name) = LOWER($1)
      AND category_id <> $2
      `,
      [category_name, id]
    );

    if (duplicate.rows.length > 0) {
      return res.status(409).json({
        message: "Nama kategori sudah digunakan"
      });
    }

    const result = await pool.query(
      `
      UPDATE categories
      SET category_name = $1
      WHERE category_id = $2
      RETURNING *
      `,
      [category_name, id]
    );

    res.status(200).json({
      message: "Kategori berhasil diupdate",
      category: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

export const deleteCategory = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const category = await pool.query(
      `
      SELECT *
      FROM categories
      WHERE category_id = $1
      `,
      [id]
    );

    if (category.rows.length === 0) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan"
      });
    }

    const productUsed = await pool.query(
      `
      SELECT 1
      FROM products
      WHERE category_id = $1
      LIMIT 1
      `,
      [id]
    );

    if (productUsed.rows.length > 0) {
      return res.status(400).json({
        message: "Kategori masih digunakan oleh produk"
      });
    }

    await pool.query(
      `
      DELETE FROM categories
      WHERE category_id = $1
      `,
      [id]
    );

    res.status(200).json({
      message: "Kategori berhasil dihapus"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};