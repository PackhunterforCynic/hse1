import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router';
import { fetchChatStream } from '../api/chat';

const AIContext = createContext();

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}



export function AIProvider({ children }) {
  const location = useLocation();
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('havilah-ai-chat');
      return saved ? JSON.parse(saved) : [{ 
        role: 'assistant', 
        content: 'Welcome to Havilah Studio. I am your AI concierge. How can I assist you in crafting your vision today?' 
      }];
    } catch {
      return [];
    }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const abortControllerRef = useRef(null);

  const saveMessages = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem('havilah-ai-chat', JSON.stringify(newMessages));
  };

  const toggleChat = useCallback(() => setIsOpen(prev => !prev), []);

  const clearChat = useCallback(() => {
    try {
      const history = JSON.parse(localStorage.getItem('havilah-ai-chat-history') || '[]');
      if (messages.length > 1) {
        history.push({
          timestamp: new Date().toISOString(),
          conversation: messages
        });
        // keep only the last 10 sessions to avoid massive localStorage bloating
        if (history.length > 10) history.shift();
        localStorage.setItem('havilah-ai-chat-history', JSON.stringify(history));
      }
    } catch (e) {
      console.error("Failed to archive chat history", e);
    }

    const hour = new Date().getHours();
    let greeting = "Good evening";
    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";

    const defaultMsg = [{ 
      role: 'assistant', 
      content: `${greeting}! I've cleared our previous conversation. How can I assist you with your creative vision today?` 
    }];
    saveMessages(defaultMsg);
  }, [messages]);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const userMessage = { role: 'user', content };
    const updatedMessages = [...messages, userMessage];
    saveMessages(updatedMessages);
    
    setIsTyping(true);

    try {
      const stream = await fetchChatStream(updatedMessages, location.pathname, signal);
      
      const assistantMessage = { role: 'assistant', content: '' };
      saveMessages([...updatedMessages, assistantMessage]);
      
      while (true) {
        if (signal.aborted) break;
        
        const { done, value } = await stream.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        
        // Process SSE payload
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr) {
              try {
                const data = JSON.parse(dataStr);
                if (data.error) {
                  assistantMessage.content += `\n\n**Error:** ${data.error}`;
                } else if (data.text) {
                  assistantMessage.content += data.text;
                }
              } catch (e) {
                console.error("SSE parse error", e, dataStr);
              }
            }
          }
        }
        
        saveMessages([...updatedMessages, { ...assistantMessage }]);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        saveMessages([
          ...updatedMessages, 
          { role: 'assistant', content: `**Connection Error:** ${error.message || 'Unable to reach the studio concierge.'}` }
        ]);
      }
    } finally {
      setIsTyping(false);
    }
  }, [messages, location.pathname]);

  return (
    <AIContext.Provider value={{
      messages,
      isTyping,
      isOpen,
      setIsOpen,
      toggleChat,
      sendMessage,
      clearChat
    }}>
      {children}
    </AIContext.Provider>
  );
}


