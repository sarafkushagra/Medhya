// controllers/chatController.js
import { openRouterChat } from "../utils/OpenRouter.js";

const sendMessage = async (req, res) => {
  const { user_message } = req.body;

  if (!user_message?.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const reply = await openRouterChat(user_message);
    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};


export default sendMessage;