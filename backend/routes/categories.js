import express from "express";

import {
  getCategories,
  createCategory
} from "../controllers/categoryController.js";

import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";

const router = express.Router();

router.get("/", getCategories);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCategory
);

export default router;