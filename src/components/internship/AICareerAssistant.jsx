import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCursor } from '../../context/CursorContext';

export default function AICareerAssistant() {
  const { updateCursor, resetCursor } = useCursor();
  const [chat, setChat] = useState([
    { role: 'ai', text: "Hello! I'm the Havilah AI Career Assistant. How can I help you find your place in our studio?" }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setChat(prev => [...prev, { role: 'user', text: input }]);
    const userMsg = input;
    setInput('');

    setTimeout(() => {
      let reply = "That's a great question! Our recruitment team looks for passion and a unique perspective above all else. Make sure your portfolio reflects your personal style.";
      const lowerMsg = userMsg.toLowerCase();
      
      if (lowerMsg.includes('portfolio')) {
        reply = "For your portfolio, we prefer quality over quantity. Select your 3-5 best pieces and tell us the story behind them.";
      } else if (lowerMsg.includes('remote')) {
        reply = "While we value flexibility, our creative process thrives on in-person collaboration. We prefer candidates who can work from our Bangalore studio.";
      } else if (lowerMsg.includes('software') || lowerMsg.includes('tools')) {
        reply = "We primarily use Premiere Pro, DaVinci Resolve, Figma, and After Effects, but we're always open to new tools if they elevate the work.";
      } else if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
        reply = "Hello there! Feel free to ask me anything about our internship program, the studio culture, or portfolio requirements.";
      }

      setChat(prev => [...prev, { role: 'ai', text: reply }]);
    }, 1000);
  };

  return (
    <div className="w-full py-32 bg-white/5 backdrop-blur-md px-6 md:px-12 relative z-10 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20 mb-6">
            <Sparkles size={16} />
            <span className="text-xs font-mono uppercase tracking-widest">AI Assistant</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display uppercase tracking-tight mb-6">
            Find Your <br/> Perfect Fit.
          </h2>
          <p className="text-lg text-white/70 mb-8 font-sans font-light leading-relaxed">
            Not sure which role suits you? Wondering what we look for in a portfolio? Ask our AI assistant to get instant insights into our recruitment process.
          </p>
          
          <div className="flex flex-wrap gap-3">
            {["What should be in my portfolio?", "Do I need a degree?", "What software do you use?"].map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xs font-mono tracking-widest cursor-none"
                onMouseEnter={() => updateCursor({ active: true })}
                onMouseLeave={resetCursor}
              >
                {q}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 h-[500px] bg-primary rounded-3xl border border-white/10 p-6 flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-bg to-transparent z-10 pointer-events-none" />
          
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 pt-12 pb-6 px-2 relative z-0">
            {chat.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[80%] p-4 rounded-2xl text-sm font-sans font-light leading-relaxed ${msg.role === 'ai' ? 'bg-white/5 border border-white/10 text-white/90 self-start rounded-tl-none' : 'bg-accent/20 border border-accent/30 text-white self-end rounded-tr-none'}`}
              >
                {msg.text}
              </motion.div>
            ))}
            <div ref={chatEndRef} className="h-1" />
          </div>

          <form onSubmit={handleSend} className="relative z-20 mt-4">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full bg-white/5 border border-white/10 focus:border-accent/50 rounded-xl px-6 py-4 outline-none transition-all duration-300 font-sans text-sm text-white placeholder-white/30 cursor-none"
              onMouseEnter={() => updateCursor({ active: true })}
              onMouseLeave={resetCursor}
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg bg-accent text-bg hover:bg-white transition-colors cursor-none"
              onMouseEnter={() => updateCursor({ active: true })}
              onMouseLeave={resetCursor}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
