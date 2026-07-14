/**
 * Sends a message to the backend chat API and returns a reader for the SSE stream.
 * @param {Array<{role: string, content: string}>} messages 
 * @param {string} pageContext
 * @param {AbortSignal} signal 
 * @returns {Promise<ReadableStreamDefaultReader>}
 */
export async function fetchChatStream(messages, pageContext, signal) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, pageContext }),
    signal
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch chat stream.';
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch {
      // Ignore JSON parse error if body is plain text
    }
    throw new Error(errorMsg);
  }

  return response.body.getReader();
}
