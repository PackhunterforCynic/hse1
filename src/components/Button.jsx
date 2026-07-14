import { useCursor } from '../context/CursorContext';

export default function Button({ children, onClick, className = '', variant = 'primary' }) {
  const { updateCursor, resetCursor } = useCursor();

  const handleMouseEnter = () => {
    updateCursor({ active: true, text: '' });
  };

  const handleMouseLeave = () => {
    resetCursor();
  };

  const baseClasses = "relative px-8 py-4 overflow-hidden uppercase tracking-widest text-sm font-medium transition-colors duration-500 rounded-full cursor-none";
  const variants = {
    primary: "bg-text text-bg md:hover:bg-accent md:hover:text-bg",
    outline: "border border-text/30 text-text md:hover:border-text md:hover:bg-text md:hover:text-bg",
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <span className="block pointer-events-none">
        {children}
      </span>
    </button>
  );
}
