import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSendMessage, isTyping, showSuggestions, onSuggestionClick }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col bg-black/20">
      {/* Suggestions (only if not typing and showSuggestions is true) */}
      {showSuggestions && !isTyping && (
        <div className="px-6 pt-4 pb-2 flex flex-wrap gap-2">
          <button onClick={() => onSuggestionClick("What services do you offer?")} className="text-xs border border-white/10 hover:border-white/30 bg-white/5 px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-colors">
            Services
          </button>
          <button onClick={() => onSuggestionClick("Tell me about your wedding projects")} className="text-xs border border-white/10 hover:border-white/30 bg-white/5 px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-colors">
            Weddings
          </button>
          <button onClick={() => onSuggestionClick("What is your pricing model?")} className="text-xs border border-white/10 hover:border-white/30 bg-white/5 px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-colors">
            Pricing
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about our studio..."
            className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-full py-3 pl-5 pr-12 text-sm text-white placeholder-white/30 outline-none transition-colors"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 rounded-full bg-white text-black disabled:opacity-50 transition-opacity"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
