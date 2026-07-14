import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { projects } from '../data/projects';

export default function AISearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Keyboard Shortcuts (CMD+K) globally
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // The toggle should ideally be handled at a higher level, 
        // but this ensures the modal closes on ESC
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Simple fuzzy matching logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
    
    const matched = projects.map(p => {
      let score = 0;
      const title = p.title.toLowerCase();
      const category = p.category.toLowerCase();
      const story = p.story.toLowerCase();
      const tags = p.tags ? p.tags.join(' ').toLowerCase() : '';

      searchTerms.forEach(term => {
        if (title.includes(term)) score += 10;
        if (category.includes(term)) score += 5;
        if (tags.includes(term)) score += 5;
        if (story.includes(term)) score += 1;
      });

      return { project: p, score };
    }).filter(p => p.score > 0).sort((a, b) => b.score - a.score);

    setResults(matched.map(m => m.project));
  }, [query]);

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex flex-col pt-[10vh] px-4 md:px-0"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="w-full max-w-4xl mx-auto flex flex-col h-[80vh]">
            {/* Search Input */}
            <div className="relative mb-8">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50" size={28} />
              <input 
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for? (e.g. Wedding videos, Drone...)"
                className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl py-6 pl-20 pr-6 text-xl md:text-3xl font-display text-white placeholder-white/30 outline-none transition-all"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Sparkles size={20} className="text-accent" />
                <span className="text-xs font-mono uppercase text-accent tracking-widest hidden md:inline">AI Search</span>
              </div>
            </div>

            {/* Suggestions (Empty State) */}
            {!query && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <p className="text-xs font-mono uppercase tracking-widest text-white/50">Suggested Searches</p>
                <div className="flex flex-wrap gap-3">
                  {['Wedding videos', 'Drone footage', 'Commercial architecture', 'Cultural documentary'].map((s) => (
                    <button 
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-sm font-mono"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Results */}
            {query && (
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4 pb-12">
                <p className="text-xs font-mono uppercase tracking-widest text-white/50 mb-2">
                  {results.length} Results Found
                </p>
                
                {results.length > 0 ? (
                  results.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link 
                        to={`/projects/${project.id}`}
                        onClick={onClose}
                        className="group flex flex-col md:flex-row gap-6 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all items-center"
                      >
                        <div className="w-full md:w-48 h-32 overflow-hidden rounded-lg bg-surface shrink-0">
                          <img 
                            src={project.cover} 
                            alt={project.title} 
                            className="w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" 
                          />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          <p className="text-xs font-mono uppercase tracking-widest text-accent">{project.category}</p>
                          <h3 className="text-2xl font-display uppercase tracking-wider text-white group-hover:text-accent transition-colors">{project.title}</h3>
                          <p className="text-sm text-white/50 line-clamp-2">{project.story}</p>
                          
                          {project.tags && (
                            <div className="flex gap-2 mt-2">
                              {project.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] font-mono uppercase text-white/40 border border-white/10 px-2 py-0.5 rounded-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-white/20 group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                          <ArrowRight size={20} />
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-white/50">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="font-mono uppercase tracking-widest text-sm">No exact matches found</p>
                    <p className="text-sm mt-2">Try adjusting your terms.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
