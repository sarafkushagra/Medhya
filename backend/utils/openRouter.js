// services/openRouter.js
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_ID = "meta-llama/llama-3.3-70b-instruct:free";

const systemPrompt = `
A Simple Hello should yield a simple 'Hello, I am your Health Assistant.'
You are a globally trusted Senior General Physician... [your full prompt]
`.trim();




// Helper function to remove Markdown bold/italic
const stripMarkdown = (text) => {
  if (!text) return text;
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold**
    .replace(/\*(.*?)\*/g, '$1')      // Remove *italic*
    .replace(/__(.*?)__/g, '$1')      // Remove __underline__ (if any)
    .replace(/_(.*?)_/g, '$1')        // Remove _italic_
    .replace(/`([^`]+)`/g, '$1')      // Remove `code`
    .replace(/#{1,6}\s?/g, '')        // Remove headers #
    .replace(/\n{3,}/g, '\n\n')       // Reduce multiple newlines
    .trim();
};

export const openRouterChat = async (userMessage) => {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
      "X-Title": "NeuroPath Health",
    },
    body: JSON.stringify({
      model: MODEL_ID,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 512,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error: ${response.status} – ${err}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content || "No response.";

  // Clean Markdown formatting
  const cleanContent = stripMarkdown(rawContent);

  return cleanContent;
};