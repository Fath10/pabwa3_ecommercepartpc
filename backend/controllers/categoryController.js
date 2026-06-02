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
      ORDER BY category_name
      `
    );

    res.json(result.rows);

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

    res.status(201).json(
      result.rows[0]
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};