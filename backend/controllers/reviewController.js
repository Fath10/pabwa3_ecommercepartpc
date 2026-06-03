import pool from "../config/db.js";

export const getProductReviews = async (
  req,
  res
) => {

  try {

    const { productId } = req.params;

    const result = await pool.query(
      `
      SELECT
        pr.review_id,
        pr.rating,
        pr.comment,
        pr.created_at,
        u.user_id,
        u.name

      FROM products_reviews pr

      JOIN users u
      ON pr.user_id = u.user_id

      WHERE pr.product_id = $1

      ORDER BY pr.created_at DESC
      `,
      [productId]
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

};

export const createReview = async (
  req,
  res
) => {

  try {
    const { productId } = req.params;
    const {
      rating,
      comment
    } = req.body;
    const user_id =
      req.user.user_id;

    if (
      !rating ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message:
          "Rating harus antara 1-5"
      });
    }

    const duplicate =
      await pool.query(
        `
        SELECT *
        FROM products_reviews
        WHERE product_id = $1
        AND user_id = $2
        `,
        [
          productId,
          user_id
        ]
      );

    if (
      duplicate.rows.length > 0
    ) {
      return res.status(409).json({
        message:
          "Anda sudah memberikan review"
      });
    }

    const result =
      await pool.query(
        `
        INSERT INTO products_reviews
        (
          product_id,
          user_id,
          rating,
          comment
        )
        VALUES
        ($1,$2,$3,$4)
        RETURNING *
        `,
        [
          productId,
          user_id,
          rating,
          comment
        ]
      );
    res.status(201).json(
      result.rows[0]
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const updateReview = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const {
      rating,
      comment
    } = req.body;
      const user_id =
      req.user.user_id;

    const result =
      await pool.query(
        `
        UPDATE products_reviews
        SET
          rating = $1,
          comment = $2
        WHERE review_id = $3
        AND user_id = $4
        RETURNING *
        `,
        [
          rating,
          comment,
          id,
          user_id 
        ]
      );
    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Review tidak ditemukan"
      });
    }
    res.json(result.rows[0]);
    
    if(
      result.rating < 0||result.rating > 5
    ) {
      return res.status(400).json({
        message: "Rating tidak boleh kurang dari 0 dan lebih dari 5"
      });
    }
    
    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Review tidak ditemukan"
      });
    }
    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const deleteReview = async (
  req,
  res
) => {

  try {
    const { id } = req.params;
    const user_id =req.user.user_id;
    const result =
      await pool.query(
        `
        DELETE FROM products_reviews
        WHERE review_id = $1
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
          "Review tidak ditemukan"
      });
    }
    res.json({
      message:
        "Review berhasil dihapus"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};
