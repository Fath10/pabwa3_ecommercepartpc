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
        r.review_id,
        r.rating,
        r.comment,
        r.created_at,

        u.user_id,
        u.name

      FROM reviews r

      JOIN users u
      ON r.user_id = u.user_id

      WHERE r.product_id = $1

      ORDER BY r.created_at DESC
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
        FROM reviews
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
        INSERT INTO reviews
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

    const result =
      await pool.query(
        `
        UPDATE reviews
        SET
          rating = $1,
          comment = $2
        WHERE review_id = $3
        RETURNING *
        `,
        [
          rating,
          comment,
          id
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
    const result =
      await pool.query(
        `
        DELETE FROM reviews
        WHERE review_id = $1
        RETURNING *
        `,
        [id]
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
