import { GoogleGenerativeAI } from "@google/generative-ai";

// Cache for the GenerativeModel instance
let model = null;

import fs from 'fs';
import path from 'path';

// The system prompt injects our portfolio knowledge and sets the AI personality.
const getSystemPrompt = () => {
  try {
    const strategyPath = path.join(process.cwd(), 'strategy.txt');
    return fs.readFileSync(strategyPath, 'utf8');
  } catch (error) {
    console.error("Could not read strategy.txt, falling back to default prompt.", error);
    return `You are a premium AI Concierge for Havilah Studio, an elite creative agency based in Bangalore, India.
Your role is to act as a highly professional, concise, and helpful consultant for visitors to the studio's portfolio website.`;
  }
};

// Cache for proven working model name
let activeModelName = null;

export const createModel = (modelName) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing on this server. Please add it to your Vercel Project Environment Variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: getSystemPrompt(),
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  });
};

export const initializeGemini = () => {
  const defaultModel = activeModelName || process.env.GEMINI_MODEL || "gemini-2.5-flash";
  return createModel(defaultModel);
};

/**
 * Sends a conversation to Gemini and returns a readable stream.
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} pageContext
 * @returns {ReadableStream} 
 */
export const streamGeminiResponse = async (messages, pageContext, userName) => {
  // Convert generic role structure to Gemini's format
  // Gemini expects: { role: 'user' | 'model', parts: [{ text: string }] }
  // It MUST start with a 'user' message and MUST alternate.
  let formattedMessages = [];
  let currentRole = 'user';

  for (const msg of messages) {
    if (msg.role === 'assistant') {
      if (currentRole === 'user') continue; // Skip assistant message if we expect a user message (e.g. at the start)
      formattedMessages.push({ role: 'model', parts: [{ text: msg.content }] });
      currentRole = 'user';
    } else {
      if (currentRole === 'model') {
        // Two user messages in a row? Just append to the previous one to keep alternating structure
        if (formattedMessages.length > 0) {
          formattedMessages[formattedMessages.length - 1].parts[0].text += '\n\n' + msg.content;
        }
      } else {
        formattedMessages.push({ role: 'user', parts: [{ text: msg.content }] });
        currentRole = 'model';
      }
    }
  }

  // If after filtering we have no messages, fallback to a default prompt
  if (formattedMessages.length === 0) {
    formattedMessages.push({ role: 'user', parts: [{ text: 'Hello' }] });
  }

  // The very last message should be a user message (so the model can reply)
  if (formattedMessages[formattedMessages.length - 1].role !== 'user') {
    formattedMessages.pop();
  }

  // Inject user name and page context into the very last user message
  if ((pageContext || userName) && formattedMessages.length > 0) {
    const lastMsgIndex = formattedMessages.length - 1;
    if (formattedMessages[lastMsgIndex].role === 'user') {
      const originalText = formattedMessages[lastMsgIndex].parts[0].text;
      let contextNote = `[System Context:`;
      if (userName) contextNote += ` The distinguished guest conversing with you is named "${userName}". Address them respectfully and personally by name when appropriate, maintaining an elite, cinematic, and consultative tone.`;
      if (pageContext) contextNote += ` They are currently viewing the studio page: ${pageContext}.`;
      contextNote += `]\n\n`;
      formattedMessages[lastMsgIndex].parts[0].text = contextNote + originalText;
    }
  }

  // Multi-Model Auto-Discovery & Resilience Engine
  // Silently attempts modern 2026 model variations without trying retired legacy endpoints
  const candidateModels = Array.from(new Set([
    activeModelName,
    process.env.GEMINI_MODEL,
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.0-flash"
  ].filter(Boolean)));

  let lastError = null;
  let hitQuotaLimit = false;

  for (const modelName of candidateModels) {
    try {
      const currentModel = createModel(modelName);
      const result = await currentModel.generateContentStream({ contents: formattedMessages });

      // Successfully connected! Cache working model name for lightning-fast future interactions
      activeModelName = modelName;
      console.log(`[Gemini AI Studio Concierge] Engaged model: ${activeModelName}`);

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              if (chunkText) {
                controller.enqueue(new TextEncoder().encode(chunkText));
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        }
      });
    } catch (err) {
      const errStr = err.message || "";
      if (errStr.includes("429") || errStr.includes("quota") || errStr.includes("Too Many Requests")) {
        hitQuotaLimit = true;
      }
      console.warn(`[Model Fallback Diagnostic]: '${modelName}' unavailable (${errStr.split('\n')[0]}). Trying next active studio model...`);
      lastError = err;
    }
  }

  console.error("Gemini API Error - All candidate models failed:", lastError);
  if (hitQuotaLimit) {
    throw new Error("⚠️ Gemini AI Quota Exceeded: Your Google Generative AI API key has temporarily reached its rate limit or daily quota. Please pause a moment before retrying, or check your API key usage plan at https://aistudio.google.com/.");
  }
  throw new Error(lastError?.message || "Failed to generate response from any active Gemini API models.");
};
