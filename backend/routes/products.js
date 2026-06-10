import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductPermanent
} from "../controllers/productController.js";

import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

router.delete(
  "/:id/permanent",
  authMiddleware,
  adminMiddleware,
  deleteProductPermanent
);

export default router;