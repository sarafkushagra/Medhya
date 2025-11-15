// controllers/chatController.js
import { openRouterChat } from "../utils/openRouter.js";

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









// // controllers/chatController.js
// import { openRouterChatStream } from "../utils/OpenRouter.js";

// const sendMessageStream = async (req, res) => {
//   // Detect GET ?stream=1 vs normal POST
//   const isStreamRequest = req.method === 'GET' && req.query.stream === '1';
//   const { user_message, lang = 'en-US' } = isStreamRequest ? req.query : req.body;

//   if (!user_message?.trim()) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   // SSE headers
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   res.flushHeaders();

//   try {
//     const stream = await openRouterChatStream(user_message, lang);

//     for await (const chunk of stream) {
//       const content = chunk.choices?.[0]?.delta?.content;
//       if (content) {
//         res.write(`data: ${JSON.stringify({ content })}\n\n`);
//       }
//     }

//     if (stream.finalChunk?.usage) {
//       res.write(`data: ${JSON.stringify({ usage: stream.finalChunk.usage })}\n\n`);
//     }

//     res.write(`event: done\ndata: {}\n\n`);
//     res.end();
//   } catch (error) {
//     console.error("Streaming error:", error);
//     res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
//     res.end();
//   }
// };

// export default sendMessageStream;