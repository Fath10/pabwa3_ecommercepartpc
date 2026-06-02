import express from "express";

import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
} from "../controllers/reviewController.js";

import {
  authMiddleware
} from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/product/:productId",
  getProductReviews
);

router.post(
  "/product/:productId",
  authMiddleware,
  createReview
);

router.put(
  "/:id",
  authMiddleware,
  updateReview
);

router.delete(
  "/:id",
  authMiddleware,
  deleteReview
);

export default router;