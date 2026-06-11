import express from "express";
import { chat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", chat);
router.options("/", (req, res) => res.sendStatus(200)); // ← CORS preflight

export default router;
