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
import router from './products.js';

const router = express.Router();
router.post(
  "/checkout",
  authMiddleware,
  checkout
);

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getOrders
);

router.get(
  "/:id",
  authMiddleware,
  getOrderById
);

router.patch(
  "/admin/orders/:id/process",
  authMiddleware,
  adminMiddleware,
  processOrder
);

router.patch(
  "/admin/orders/:id/ship",
  authMiddleware,
  adminMiddleware,
  shipOrder
);

router.patch(
  "/orders/:id/deliver",
  authMiddleware,
  deliverOrder
);

export default router;