// utils/openRouter.js
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

export const openRouterChat = async (userMessage, lang = 'en-US') => {
  const models = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "openrouter/free"
  ];

  let lastError = null;

  for (const model of models) {
    const maxRetries = 2; // Try up to 2 times for 429s on each model
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[OpenRouter] Attempting model: ${model} (Attempt ${attempt}/${maxRetries})`);
        const response = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
            "X-Title": "NeuroPath Health",
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 512,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          let errorJson = null;
          try {
            errorJson = JSON.parse(errText);
          } catch (e) {
            // Not JSON
          }

          if (response.status === 429) {
            // Extract retry delay
            const retryAfter = errorJson?.error?.metadata?.retry_after_seconds || 
                               errorJson?.error?.metadata?.retry_after_seconds_raw;
            const retryAfterHeader = response.headers.get("retry-after");
            
            let delayMs = 2000; // default backoff
            if (retryAfter) {
              delayMs = parseFloat(retryAfter) * 1000;
            } else if (retryAfterHeader) {
              const parsedHeader = parseFloat(retryAfterHeader);
              if (!isNaN(parsedHeader)) {
                delayMs = parsedHeader * 1000;
              }
            }

            console.warn(`[OpenRouter] Rate limited (429) on ${model}. Suggested delay: ${delayMs}ms.`);

            // If wait time is too long (> 10s), don't block the user, switch to the next fallback model
            if (delayMs > 10000) {
              console.warn(`[OpenRouter] Delay is too long (>10s). Switching to fallback model.`);
              lastError = new Error(`Rate limit delay too long: ${delayMs}ms`);
              break; // break the attempt loop, moves to the next model
            }

            if (attempt < maxRetries) {
              const waitTime = delayMs + 500; // Add 500ms safety buffer
              console.log(`[OpenRouter] Waiting ${waitTime}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue; // retry the attempt loop
            } else {
              console.warn(`[OpenRouter] Max retries reached for ${model}.`);
              lastError = new Error(`Rate limit exceeded after retries: ${errText}`);
              break; // moves to next model
            }
          } else {
            // Other error status (e.g. 500, 503, 401)
            console.warn(`[OpenRouter] Received error status ${response.status} for ${model}: ${errText}`);
            lastError = new Error(`Status ${response.status}: ${errText}`);
            break; // break the attempt loop, moves to the next model immediately
          }
        }

        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content || "No response.";
        return stripMarkdown(rawContent);

      } catch (err) {
        console.error(`[OpenRouter] Network or unexpected error for ${model}:`, err);
        lastError = err;
        break; // moves to the next model
      }
    }
  }

  // If we exhausted all models
  throw new Error(`All OpenRouter models failed. Last error: ${lastError?.message}`);
};





// // utils/OpenRouter.js
// const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
// const MODEL_ID = "meta-llama/llama-3.3-70b-instruct:free";

// const systemPrompt = `
// A Simple Hello should yield a simple 'Hello, I am your Health Assistant.'
// You are a globally trusted Senior General Physician...
// `.trim();

// const stripMarkdown = (text) => {
//   if (!text) return text;
//   return text
//     .replace(/\*\*(.*?)\*\*/g, '$1')
//     .replace(/\*(.*?)\*/g, '$1')
//     .replace(/__(.*?)__/g, '$1')
//     .replace(/_(.*?)_/g, '$1')
//     .replace(/`([^`]+)`/g, '$1')
//     .replace(/#{1,6}\s?/g, '')
//     .replace(/\n{3,}/g, '\n\n')
//     .trim();
// };

// export const openRouterChatStream = async (userMessage) => {
//   const response = await fetch(OPENROUTER_URL, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       "Content-Type": "application/json",
//       "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
//       "X-Title": "NeuroPath Health",
//     },
//     body: JSON.stringify({
//       model: MODEL_ID,
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userMessage },
//       ],
//       temperature: 0.7,
//       max_tokens: 512,
//       stream: true,
//     }),
//   });

//   if (!response.ok) {
//     const err = await response.text();
//     throw new Error(`OpenRouter error: ${response.status} – ${err}`);
//   }

//   const reader = response.body.getReader();
//   const decoder = new TextDecoder();
//   let buffer = "";
//   let finalChunk = null;

//   const stream = {
//       [Symbol.asyncIterator]: async function* () {
//         while (true) {
//           const { done, value } = await reader.read();
//           if (done) break;

//           buffer += decoder.decode(value, { stream: true });
//           const lines = buffer.split("\n");
//           buffer = lines.pop(); // last incomplete line

//           for (const line of lines) {
//             if (line.startsWith("data: ")) {
//               const data = line.slice(6);
//               if (data === "[DONE]") {
//                 continue;
//               }
//               try {
//                 const json = JSON.parse(data);
//                 if (json.choices?.[0]?.delta?.content) {
//                   const clean = stripMarkdown(json.choices[0].delta.content);
//                   yield { ...json, choices: [{ delta: { content: clean } }] };
//                 }
//                 if (json.usage) {
//                   finalChunk = json;
//                 }
//               } catch (e) {
//                 console.warn("Failed to parse chunk:", data);
//               }
//             }
//           }
//         }
//       },
//       finalChunk,
//     };

//   return stream;
// };