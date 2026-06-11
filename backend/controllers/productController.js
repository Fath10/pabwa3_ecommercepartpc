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
      c.category_name,

      COALESCE(
        ROUND(AVG(pr.rating), 1),
        0
      ) AS rating,

      COUNT(DISTINCT pr.review_id)
        AS review_count,

      COALESCE(
        json_agg(DISTINCT pi.image_url)
        FILTER (
          WHERE pi.image_id IS NOT NULL
        ),
        '[]'
      ) AS images,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', pb.badge_id,
            'name', pb.badge_name,
            'color', pb.badge_color
          )
        )
        FILTER (
          WHERE pb.badge_id IS NOT NULL
        ),
        '[]'
      ) AS badges

    FROM products p

    JOIN categories c
    ON p.category_id = c.category_id

    LEFT JOIN product_images pi
    ON p.product_id = pi.product_id

    LEFT JOIN product_badge_details pbd
    ON p.product_id = pbd.product_id

    LEFT JOIN product_badges pb
    ON pbd.badge_id = pb.badge_id

    LEFT JOIN products_reviews pr
    ON p.product_id = pr.product_id

    WHERE p.is_active = TRUE

    GROUP BY
      p.product_id,
      c.category_name

    ORDER BY p.product_id DESC
    `);

    const products = result.rows.map((product) => ({
      id: product.product_id,
      name: product.product_name,
      category: product.category_name,
      price: Number(product.price),
      originalPrice: Number(product.original_price),
      image: product.images?.[0] || null,
      badge: product.badges?.[0]?.name || null,
      badgeColor: product.badges?.[0]?.color || null,
      rating: Number(product.rating || 0),
      reviews: Number(product.review_count || 0),
      stock: product.stock,

      description: product.description,

      specs: product.specs || [],
    }));

    res.json(products);
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
      SELECT
      p.*,
      c.category_name,

      COALESCE(
        ROUND(AVG(pr.rating), 1),
        0
      ) AS rating,

      COUNT(DISTINCT pr.review_id)
        AS review_count,

      COALESCE(
        json_agg(DISTINCT pi.image_url)
        FILTER (
          WHERE pi.image_id IS NOT NULL
        ),
        '[]'
      ) AS images,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', pb.badge_id,
            'name', pb.badge_name,
            'color', pb.badge_color
          )
        )
        FILTER (
          WHERE pb.badge_id IS NOT NULL
        ),
        '[]'
      ) AS badges

    FROM products p

    JOIN categories c
    ON p.category_id = c.category_id

    LEFT JOIN product_images pi
    ON p.product_id = pi.product_id

    LEFT JOIN product_badge_details pbd
    ON p.product_id = pbd.product_id

    LEFT JOIN product_badges pb
    ON pbd.badge_id = pb.badge_id

    LEFT JOIN products_reviews pr
    ON p.product_id = pr.product_id

      WHERE p.product_id = $1

      GROUP BY
        p.product_id,
        c.category_name;
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }

    const product = result.rows[0];

    res.json({
      id: product.product_id,
      name: product.product_name,

      categoryId: product.category_id,
      category: product.category_name,

      price: Number(product.price),
      originalPrice: Number(product.original_price),

      images: product.images || [],
      badges: product.badges || [],

      rating: Number(product.average_rating || 0),
      reviewCount: Number(product.review_count || 0),

      reviews: product.reviews || [],

      stock: product.stock,
      description: product.description,

      specs: product.specs || {},

      createdAt: product.created_at,
      updatedAt: product.updated_at,
      isActive: product.is_active,
    });
    
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const createProduct = async (req, res) => {

  let uploadedImages = [];
  const cleanupFiles = async (files = []) => {
  for (const file of files) {
    await deleteFile(file.path);
  }
};
  await pool.query("BEGIN");    
  try { 
    const {
      category_id,
      badge_ids,
      product_name,
      description,
      price,
      original_price,
      stock,
      specs
    } = req.body;

    if (!category_id || !product_name || !price || !original_price || !stock) {
      await cleanupFiles(req.files);
      return res.status(400).json({
        message:
          "Kategori, nama produk, harga, harga asli, dan stok wajib diisi"
      });
    }

    if (Number(price) <= 0 || Number(original_price) <= 0) {
      await cleanupFiles(req.files);
      return res.status(400).json({
        message:
          "Harga dan harga asli harus lebih dari 0"
      });
    }

    if (Number(stock) < 0) {
      await cleanupFiles(req.files);
      return res.status(400).json({
        message:
          "Stock tidak boleh negatif"
      });
    }

    let parsedSpecs = {};

    try {
      parsedSpecs = specs
        ? JSON.parse(specs)
        : {};

    } catch {

      await cleanupFiles(req.files);

      return res.status(400).json({
        message: "Format specs tidak valid"
      });
    }

    const category =
      await pool.query(
        `
        SELECT *
        FROM categories
        WHERE category_id = $1
        `,
        [category_id]
      );

    if (category.rows.length === 0) {
      await cleanupFiles(req.files);
      return res.status(404).json({
        message:
          "Kategori tidak ditemukan"
      });
    }

    const duplicate =
      await pool.query(
        `
        SELECT *
        FROM products
        WHERE LOWER(product_name)
        =
        LOWER($1)
        `,
        [product_name]
      );

    if (duplicate.rows.length > 0) {

      await cleanupFiles(req.files);
      return res.status(409).json({
        message:
          "Nama produk sudah digunakan"
      });
    }

    const productResult =
      await pool.query(
        `
        INSERT INTO products
        (
          category_id,
          product_name,
          description,
          price,
          original_price,
          stock,
          specs
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *
        `,
        [
          category_id,
          product_name,
          description,
          price,
          original_price,
          stock,
          JSON.stringify(parsedSpecs)
        ]
      );

    const   product =
      productResult.rows[0];

    let parsedBadges = [];

    try{
      parsedBadges = badge_ids ?
      JSON.parse(badge_ids) : [];
    } catch {
      parsedBadges = [];
    }

    for (
      const badgeId
      of parsedBadges
    ) {

      await pool.query(
        `
        INSERT INTO
        product_badge_details
        (
          product_id,
          badge_id
        )
        VALUES
        ($1,$2)
        `,
        [
          product.product_id,
          badgeId
        ]
      );

    }

    if (
      req.files &&
      req.files.length > 0
    ) {

      for (const file of req.files) {

        const imagePath =
          await moveFile(
            file.path,
            file.filename
          );

        uploadedImages.push(imagePath);

        await pool.query(
          `
          INSERT INTO product_images
          (
            product_id,
            image_url
          )
          VALUES
          ($1,$2)
          `,
          [
            product.product_id,
            imagePath
          ]
        );

      }

    }
      await pool.query("COMMIT");
    res.status(201).json({
      message:
        "Produk berhasil dibuat",
      product
    });

  } catch (error) {
    await pool.query("ROLLBACK");

    console.error(error);

    await cleanupFiles(uploadedImages);

    res.status(500).json({
      message:
        "Gagal menambah produk"
    });

  }

};

export const updateProduct = async (req, res) => {
  await pool.query("BEGIN");
  try {

    const {
      category_id,
      badge_ids,
      product_name,
      description,
      price,
      original_price,
      stock,
      specs
    } = req.body;

    console.log(specs);

    const existingProduct = await pool.query(
      `
      SELECT *
      FROM products
      WHERE product_id = $1
      `,
      [req.params.id]
    );

    if (existingProduct.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({
        message: "Produk tidak ditemukan"
      });
    }

    const currentProduct =
      existingProduct.rows[0];

    const updatedCategoryId =
      category_id ?? currentProduct.category_id;

    const updatedProductName =
      product_name ?? currentProduct.product_name;

    const updatedDescription =
      description ?? currentProduct.description;

    const updatedPrice =
      price ?? currentProduct.price;

    const updatedOriginalPrice =
      original_price ?? currentProduct.original_price;

    const updatedStock =
      stock ?? currentProduct.stock;

    let updatedSpecs =
      currentProduct.specs;

    console.log(updatedSpecs);

    if (specs !== undefined) {

      try {

        updatedSpecs =
          JSON.stringify(
            JSON.parse(specs)
          );

      } catch {
        return res.status(400).json({
          message: "Format specs tidak valid"
        });
      }
    }

    const duplicate =
      await pool.query(
        `
        SELECT *
        FROM products
        WHERE LOWER(product_name) = LOWER($1)
        AND product_id <> $2
        `,
        [
          updatedProductName,
          req.params.id
        ]
      );

    if (duplicate.rows.length > 0) {
      await pool.query("ROLLBACK");
      return res.status(409).json({
        message:
          "Nama produk sudah digunakan"
      });
    }

    if (
      Number(updatedPrice) <= 0
    ) {
      await pool.query("ROLLBACK");
      return res.status(400).json({
        message:
          "Harga harus lebih dari 0"
      });
    }

    if (
      Number(updatedOriginalPrice) <= 0
    ) {
      await pool.query("ROLLBACK");
      return res.status(400).json({
        message:
          "Harga asli harus lebih dari 0"
      });
    }

    if (
      Number(updatedStock) < 0
    ) {
      await pool.query("ROLLBACK");
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
          original_price = $5,
          stock = $6,
          specs = $7
        WHERE product_id = $8
        RETURNING *
        `,
        [
          updatedCategoryId,
          updatedProductName,
          updatedDescription,
          updatedPrice,
          updatedOriginalPrice,
          updatedStock,
          JSON.stringify(updatedSpecs),
          req.params.id
        ]
      );

    if (
      req.files &&
      req.files.length > 0
    ) {

      const oldImages =
        await pool.query(
          `
          SELECT *
          FROM product_images
          WHERE product_id = $1
          `,
          [req.params.id]
        );

      for (
        const image
        of oldImages.rows
      ) {

        await deleteFile(
          image.image_url.replace("/", "")
        );

      }

      await pool.query(
        `
        DELETE FROM product_images
        WHERE product_id = $1
        `,
        [req.params.id]
      );

      for (
        const file
        of req.files
      ) {

        await pool.query(
          `
          INSERT INTO product_images
          (
            product_id,
            image_url
          )
          VALUES
          ($1,$2)
          `,
          [
            req.params.id,
            `/uploads/products/${file.filename}`
          ]
        );

      }

    }

    if (badge_ids !== undefined) {

      await pool.query(
        `
        DELETE FROM
        product_badge_details
        WHERE product_id = $1
        `,
        [req.params.id]
      );

      let parsedBadges = [];

      try {

        parsedBadges =
          JSON.parse(badge_ids);

      } catch {

        return res.status(400).json({
          message:
            "Format badge_ids tidak valid"
        });

      }

      for (
        const badgeId
        of parsedBadges
      ) {

        await pool.query(
          `
          INSERT INTO
          product_badge_details
          (
            product_id,
            badge_id
          )
          VALUES
          ($1,$2)
          `,
          [
            req.params.id,
            badgeId
          ]
        );

      }

    }
    await pool.query("COMMIT");
    res.json({
      message:
        "Produk berhasil diupdate",
      product:
        result.rows[0]
    });

  } catch (error) {

    console.error(error);
    await pool.query("ROLLBACK");
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

export const deleteProductPermanent = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const images = await pool.query(
      `
      SELECT image_url
      FROM product_images
      WHERE product_id = $1
      `,
      [id]
    );

    const result = await pool.query(
      `
      DELETE FROM products
      WHERE product_id = $1
      RETURNING product_id
      `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product tidak ditemukan",
      });
    }

    for (const image of images.rows) {
      await deleteFile(image.image_url);
    }

    return res.status(200).json({
      message: "Product berhasil dihapus permanen",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });

  }
};
