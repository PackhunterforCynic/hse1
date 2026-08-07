import { streamGeminiResponse } from '../server/services/gemini.js';
import { getArchive, saveArchive } from '../src/lib/cloud-storage.js';

async function saveToChatHistory(body, fullReply) {
  try {
    const { messages = [], pageContext = '/', userName = '', sessionId = '' } = body || {};
    let history = await getArchive('chats', { updatedAt: new Date().toISOString(), totalSessions: 0, totalMessages: 0, sessions: [] });
    if (!history.sessions) history.sessions = [];
    
    const activeSessionId = sessionId || ('sess_' + Date.now());
    const timestamp = new Date().toISOString();
    
    const completeMessages = messages.map(m => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp || timestamp
    }));
    if (fullReply && fullReply.trim()) {
      completeMessages.push({
        role: 'assistant',
        content: fullReply.trim(),
        timestamp
      });
    }
    
    const fullText = completeMessages.map(m => m.content).join(' ').toLowerCase();
    const possibleTopics = [
      { name: 'Cinematography', keywords: ['film', 'cinema', 'video', 'drone', 'camera', 'shot', 'production'] },
      { name: 'Photography', keywords: ['photo', 'portrait', 'shoot', 'studio', 'image', 'picture'] },
      { name: 'Weddings', keywords: ['wedding', 'bride', 'groom', 'haldi', 'marriage', 'couple'] },
      { name: 'Web Development', keywords: ['web', 'site', 'react', 'design', 'ui', 'ux', 'digital', 'app'] },
      { name: 'Growth & Strategy', keywords: ['growth', 'marketing', 'brand', 'strategy', 'ad', 'campaign', 'traffic'] },
      { name: 'Pricing & Booking', keywords: ['price', 'cost', 'quote', 'book', 'call', 'discovery', 'fee'] },
      { name: 'Internship & Careers', keywords: ['intern', 'job', 'career', 'resume', 'hire', 'join'] }
    ];
    
    const detectedTopics = possibleTopics
      .filter(t => t.keywords.some(k => fullText.includes(k)))
      .map(t => t.name);
    if (detectedTopics.length === 0) detectedTopics.push('General Inquiry');

    const existingIndex = history.sessions.findIndex(s => s.id === activeSessionId);
    if (existingIndex > -1) {
      history.sessions[existingIndex] = {
        ...history.sessions[existingIndex],
        userName: userName || history.sessions[existingIndex].userName || 'Anonymous Guest',
        pageContext: pageContext || history.sessions[existingIndex].pageContext,
        lastUpdated: timestamp,
        messageCount: completeMessages.length,
        topics: Array.from(new Set([...(history.sessions[existingIndex].topics || []), ...detectedTopics])),
        messages: completeMessages
      };
    } else {
      history.sessions.unshift({
        id: activeSessionId,
        userName: userName || 'Anonymous Guest',
        pageContext: pageContext || '/',
        startTime: timestamp,
        lastUpdated: timestamp,
        messageCount: completeMessages.length,
        topics: detectedTopics,
        messages: completeMessages
      });
    }
    
    history.updatedAt = timestamp;
    history.totalSessions = history.sessions.length;
    history.totalMessages = history.sessions.reduce((acc, s) => acc + (s.messageCount || 0), 0);
    
    await saveArchive('chats', history);
  } catch (err) {
    console.error('[Chat API Storage Error]:', err.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { messages, pageContext, userName, sessionId } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Invalid request: messages array is required.' });
      return;
    }

    const stream = await streamGeminiResponse(messages, pageContext, userName);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    
    if (res.flushHeaders) {
      res.flushHeaders();
    }

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let assistantReplyBuffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        await saveToChatHistory(req.body, assistantReplyBuffer);
        res.end();
        break;
      }
      
      const text = decoder.decode(value, { stream: true });
      if (text) {
        assistantReplyBuffer += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
  } catch (error) {
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: 'An error occurred during generation.' })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
}
