import express from "express";

import {
  getCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";

import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getCart
);

router.post(
  "/",
  authMiddleware,
  addToCart
);

router.put(
  "/:id/increase",
  authMiddleware,
  increaseQuantity
);

router.put(
  "/:id/decrease",
  authMiddleware,
  decreaseQuantity
);

router.delete(
  "/:id",
  authMiddleware,
  removeFromCart
);

router.delete(
  "/",
  authMiddleware,
  clearCart
);

export default router;