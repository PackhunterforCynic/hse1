import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Trash2, UserCheck } from 'lucide-react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatNamePrompt from './ChatNamePrompt';
import { useAI } from '../../context/AIProvider';
import { useLanguage } from '../../i18n';

export default function ChatWindow() {
  const { messages, isTyping, isOpen, toggleChat, sendMessage, clearChat, userName, saveUserName } = useAI();
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[420px] h-[90vh] md:h-[680px] z-[100] flex flex-col bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 md:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-black/60 via-black/30 to-black/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EFE6D2]/10 flex items-center justify-center border border-[#EFE6D2]/30 shadow-[0_0_10px_rgba(239,230,210,0.1)]">
                <Sparkles size={16} className="text-[#EFE6D2]" />
              </div>
              <div>
                <h3 className="font-display uppercase tracking-widest text-sm text-white font-medium">{t('ai.title')}</h3>
                <p className="text-[10px] font-mono text-[#EFE6D2]/80 tracking-wider uppercase">{t('ai.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {userName && (
                <button
                  onClick={() => saveUserName('')}
                  className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white/80 hover:text-white flex items-center gap-1.5 text-[11px] font-sans tracking-wider mr-1"
                  title="Change your name"
                >
                  <UserCheck size={13} className="text-[#EFE6D2]" />
                  <span className="max-w-[75px] truncate">{userName}</span>
                </button>
              )}
              {userName && (
                <button 
                  onClick={clearChat} 
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white" 
                  title={t('ai.clearChat')}
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button 
                onClick={toggleChat} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white ml-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {!userName ? (
            <ChatNamePrompt />
          ) : (
            <>
              <ChatMessages messages={messages} isTyping={isTyping} />

              <ChatInput 
                onSendMessage={sendMessage}
                isTyping={isTyping}
                showSuggestions={messages.length < 3}
                onSuggestionClick={sendMessage}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
