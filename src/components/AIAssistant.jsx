import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAI } from '../context/AIProvider';
import ChatWindow from './ai/ChatWindow';

export default function AIAssistant() {
  const { isOpen, toggleChat } = useAI();
  
  // Persisted position for the floating widget
  const [position, setPosition] = useState(() => {
    try {
      const pos = localStorage.getItem('havilah-ai-pos');
      return pos ? JSON.parse(pos) : { x: 0, y: 0 };
    } catch {
      return { x: 0, y: 0 };
    }
  });

  const handleDragEnd = (e, info) => {
    const newPos = { x: position.x + info.offset.x, y: position.y + info.offset.y };
    setPosition(newPos);
    localStorage.setItem('havilah-ai-pos', JSON.stringify(newPos));
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            animate={{ x: position.x, y: position.y }}
            initial={false}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[99] cursor-grab active:cursor-grabbing"
          >
            <motion.button
              onClick={toggleChat}
              className="relative flex items-center justify-center w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              animate={{
                boxShadow: [
                  "0px 0px 0px 0px rgba(255,255,255,0.1)",
                  "0px 0px 20px 2px rgba(255,255,255,0.2)",
                  "0px 0px 0px 0px rgba(255,255,255,0.1)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={24} className="text-white" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-accent rounded-full border border-black animate-pulse" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatWindow />
    </>
  );
}
