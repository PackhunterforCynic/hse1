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

export const initializeGemini = () => {
  if (model) return model;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Default to 2.5-flash if not specified, it's fast and supports system instructions.
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: getSystemPrompt(),
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  });

  return model;
};

/**
 * Sends a conversation to Gemini and returns a readable stream.
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} pageContext
 * @returns {ReadableStream} 
 */
export const streamGeminiResponse = async (messages, pageContext) => {
  const model = initializeGemini();

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

  // Inject page context into the very last user message
  if (pageContext && formattedMessages.length > 0) {
    const lastMsgIndex = formattedMessages.length - 1;
    if (formattedMessages[lastMsgIndex].role === 'user') {
      const originalText = formattedMessages[lastMsgIndex].parts[0].text;
      formattedMessages[lastMsgIndex].parts[0].text = `[System Context: The user is currently viewing the page: ${pageContext}]\n\n${originalText}`;
    }
  }

  try {
    const result = await model.generateContentStream({ contents: formattedMessages });
    
    // We return a standard web ReadableStream that can be piped to the HTTP response
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
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate response from Gemini API.");
  }
};
