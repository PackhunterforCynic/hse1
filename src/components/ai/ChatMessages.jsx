import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TypingIndicator from './TypingIndicator';

export default function ChatMessages({ messages, isTyping }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div 
      className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar overscroll-contain"
      data-lenis-prevent="true"
    >
      {messages.map((msg, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed overflow-hidden ${
            msg.role === 'user' 
              ? 'bg-white text-black rounded-tr-sm' 
              : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-sm'
          }`}>
            {msg.role === 'user' ? (
              <p>{msg.content}</p>
            ) : (
              <div className="markdown-body prose prose-invert prose-sm max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline" />,
                    code: ({ node, inline, ...props }) => 
                      inline ? <code className="bg-black/50 px-1 py-0.5 rounded text-accent" {...props} /> 
                             : <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto border border-white/10 my-4"><code {...props} /></pre>,
                    table: ({ node, ...props }) => <div className="overflow-x-auto"><table className="w-full text-left border-collapse my-4" {...props} /></div>,
                    th: ({ node, ...props }) => <th className="border-b border-white/20 pb-2 text-white font-medium" {...props} />,
                    td: ({ node, ...props }) => <td className="border-b border-white/10 py-2" {...props} />
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </motion.div>
      ))}
      
      {isTyping && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
