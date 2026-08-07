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
  const [userName, setUserNameState] = useState(() => {
    try {
      return localStorage.getItem('havilah-ai-user-name') || '';
    } catch {
      return '';
    }
  });

  const getCinematicGreeting = useCallback((name, isReset = false) => {
    const hour = new Date().getHours();
    let timeGreeting = "Good evening";
    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 18) timeGreeting = "Good afternoon";
    
    const address = name ? `, ${name}` : '';
    
    if (isReset) {
      return `${timeGreeting}${address}. I have archived our previous dialog so we may start afresh.\n\nHow would you like to direct our creative focus today?`;
    }

    return `${timeGreeting}${address}. Welcome to **Havilah Studio**.\n\nI am your AI Creative Concierge. At the convergence of cinema, narrative art, and growth strategy, we engineer timeless visual legacies for visionary brands and leaders.\n\nWhether you are exploring cinematic film production, bespoke aesthetics, or brand architecture—how may I assist in authoring your vision today?`;
  }, []);

  const [sessionId, setSessionId] = useState(() => {
    try {
      let sid = sessionStorage.getItem('havilah-ai-session-id');
      if (!sid) {
        sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        sessionStorage.setItem('havilah-ai-session-id', sid);
      }
      return sid;
    } catch {
      return 'sess_' + Date.now();
    }
  });
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('havilah-ai-chat');
      const initialName = localStorage.getItem('havilah-ai-user-name') || '';
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return [{ 
        role: 'assistant', 
        content: getCinematicGreeting(initialName) 
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

  const saveUserName = useCallback((name) => {
    const cleanName = (name || '').trim();
    setUserNameState(cleanName);
    try {
      if (cleanName) {
        localStorage.setItem('havilah-ai-user-name', cleanName);
      } else {
        localStorage.removeItem('havilah-ai-user-name');
      }
    } catch {
      // Quiet fail without console logs
    }
    
    setMessages(prev => {
      if (prev.length <= 2 && prev[0]?.role === 'assistant') {
        const updated = [
          { role: 'assistant', content: getCinematicGreeting(cleanName) },
          ...prev.slice(1)
        ];
        try {
          localStorage.setItem('havilah-ai-chat', JSON.stringify(updated));
        } catch {}
        return updated;
      }
      return prev;
    });
  }, [getCinematicGreeting]);

  const toggleChat = useCallback(() => setIsOpen(prev => !prev), []);

  const clearChat = useCallback(() => {
    try {
      const history = JSON.parse(localStorage.getItem('havilah-ai-chat-history') || '[]');
      if (messages.length > 1) {
        history.push({
          timestamp: new Date().toISOString(),
          conversation: messages
        });
        if (history.length > 10) history.shift();
        localStorage.setItem('havilah-ai-chat-history', JSON.stringify(history));
      }
      const newSid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      sessionStorage.setItem('havilah-ai-session-id', newSid);
      setSessionId(newSid);
    } catch {
      // Quiet fail without console logs
    }

    const defaultMsg = [{ 
      role: 'assistant', 
      content: getCinematicGreeting(userName, true) 
    }];
    saveMessages(defaultMsg);
  }, [messages, userName, getCinematicGreeting]);

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
      const stream = await fetchChatStream(updatedMessages, location.pathname, userName, signal, sessionId);
      
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
              } catch {
                // Silently bypass unparseable chunk without console chatter
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
  }, [messages, location.pathname, userName, sessionId]);

  return (
    <AIContext.Provider value={{
      userName,
      saveUserName,
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


