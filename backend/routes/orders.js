import express from 'express';

import {
    checkout,
    getOrders,
    getOrderById,
    processOrder,
    shipOrder,
    deliverOrder,
} from '../controllers/orderController.js';

import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";
const router = express.Router();

router.post(
  "/checkout",
  authMiddleware,
  checkout
);

router.get(
  "/",
  authMiddleware,
  getOrders
);

router.get(
  "/:id",
  authMiddleware,
  getOrderById
);

router.patch(
  "/:id/process",
  authMiddleware,
  adminMiddleware,
  processOrder
);

router.patch(
  "/:id/ship",
  authMiddleware,
  adminMiddleware,
  shipOrder
);

router.patch(
  "/:id/deliver",
  authMiddleware,
  adminMiddleware,
  deliverOrder
);

export default router;