import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createThread,
  deleteThread,
  getMessages,
  listThreads,
  sendMessage,
} from "../controllers/adminChatController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", listThreads);
router.post("/", createThread);
router.get("/:id", getMessages);
router.post("/:id/messages", sendMessage);
router.delete("/:id", deleteThread);

export default router;
