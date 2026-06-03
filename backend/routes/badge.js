import express from "express";

import {
  getBadges,
  getBadgeById,
  createBadge,
  updateBadge,
  deleteBadge
} from "../controllers/badgeController.js";

import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";

const router = express.Router();

router.get(
  "/",
  getBadges
);

router.get(
  "/:id",
  getBadgeById
);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createBadge
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateBadge
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteBadge
);

export default router;