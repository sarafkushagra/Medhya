import express from "express";
import { createChatSession, appendMessage, getChatBySession } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", createChatSession);
router.post("/:chatId/messages", appendMessage);
router.get("/session/:sessionId", getChatBySession);

export default router;


