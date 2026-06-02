import pool from "../config/db.js";

export const getBadges = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT *
      FROM product_badges
      ORDER BY badge_name ASC
      `
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

export const getBadgeById = async (
  req,
  res
) => {

  try {

    const result =
      await pool.query(
        `
        SELECT *
        FROM product_badges
        WHERE badge_id = $1
        `,
        [req.params.id]
      );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Badge tidak ditemukan"
      });
    }

    res.json(
      result.rows[0]
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error"
    });

  }

};

export const createBadge = async (
  req,
  res
) => {

  try {

    const {
      badge_name,
      badge_color
    } = req.body;

    if (
      !badge_name ||
      !badge_color
    ) {
      return res.status(400).json({
        message:
          "Nama dan warna badge wajib diisi"
      });
    }

    const duplicate =
      await pool.query(
        `
        SELECT *
        FROM product_badges
        WHERE LOWER(badge_name)
        =
        LOWER($1)
        `,
        [badge_name]
      );

    if (
      duplicate.rows.length > 0
    ) {
      return res.status(409).json({
        message:
          "Badge sudah ada"
      });
    }

    const result =
      await pool.query(
        `
        INSERT INTO product_badges
        (
          badge_name,
          badge_color
        )
        VALUES
        ($1,$2)
        RETURNING *
        `,
        [
          badge_name,
          badge_color
        ]
      );

    res.status(201).json(
      result.rows[0]
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error"
    });

  }

};

export const updateBadge = async (
  req,
  res
) => {

  try {

    const {
      badge_name,
      badge_color
    } = req.body;

    const result =
      await pool.query(
        `
        UPDATE product_badges
        SET
        badge_name = $1,
        badge_color = $2
        WHERE badge_id = $3
        RETURNING *
        `,
        [
          badge_name,
          badge_color,
          req.params.id
        ]
      );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Badge tidak ditemukan"
      });
    }

    res.json({
      message:
        "Badge berhasil diupdate",
      badge:
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

export const deleteBadge = async (
  req,
  res
) => {

  try {

    const result =
      await pool.query(
        `
        DELETE FROM
        product_badges
        WHERE badge_id = $1
        RETURNING *
        `,
        [req.params.id]
      );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Badge tidak ditemukan"
      });
    }

    res.json({
      message:
        "Badge berhasil dihapus"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error"
    });

  }

};