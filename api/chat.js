import { streamGeminiResponse } from '../server/services/gemini.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { messages, pageContext } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Invalid request: messages array is required.' });
      return;
    }

    // Initialize the streaming response
    const stream = await streamGeminiResponse(messages, pageContext);

    // Set headers for Server-Sent Events (SSE) or chunked transfer
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    
    // Vercel serverless requires flushing headers
    if (res.flushHeaders) {
      res.flushHeaders();
    }

    // Read the stream and write chunks to the response
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        res.end();
        break;
      }
      
      // We write SSE formatted data
      const text = decoder.decode(value, { stream: true });
      if (text) {
        // Replace newlines with \n to ensure standard SSE format doesn't break,
        // or just send the raw text chunk as an event payload.
        // We'll JSON stringify the chunk to safely encode newlines.
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    
    // If headers are already sent, we can't change the status code
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: 'An error occurred during generation.' })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
