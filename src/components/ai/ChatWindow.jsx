import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Trash2 } from 'lucide-react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useAI } from '../../context/AIProvider';

export default function ChatWindow() {
  const { messages, isTyping, isOpen, toggleChat, sendMessage, clearChat } = useAI();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[420px] h-[90vh] md:h-[680px] z-[100] flex flex-col bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 md:rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-black/40 to-black/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-display uppercase tracking-widest text-sm text-white">Havilah AI</h3>
                <p className="text-[10px] font-mono text-white/50 tracking-wider">Creative Consultant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearChat} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white" 
                title="Clear chat"
              >
                <Trash2 size={16} />
              </button>
              <button 
                onClick={toggleChat} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <ChatMessages messages={messages} isTyping={isTyping} />

          <ChatInput 
            onSendMessage={sendMessage}
            isTyping={isTyping}
            showSuggestions={messages.length < 3}
            onSuggestionClick={sendMessage}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
