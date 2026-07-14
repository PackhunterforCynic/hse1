import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';

const socials = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/thepraiseayodeji',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    )
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@hsedigitals',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
        <path d="m10 15 5-3-5-3z"/>
      </svg>
    )
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/917204042538?text=Hi%20Havilah!%20I%20would%20like%20to%20discuss%20a%20project%20with%20you.',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.061-.3-.15-1.265-.462-2.406-1.474-.889-.788-1.488-1.761-1.663-2.062-.175-.3-.018-.461.131-.611.135-.133.3-.347.451-.52.146-.174.196-.3.296-.496.1-.197.05-.37-.025-.52-.075-.149-.672-1.62-.922-2.216-.24-.585-.49-.505-.67-.514-.175-.01-.376-.01-.575-.01-.2 0-.523.074-.798.371-.274.296-1.049 1.02-1.049 2.489 0 1.47 1.074 2.888 1.222 3.087.15.197 2.105 3.197 5.094 4.475.713.305 1.267.488 1.7.625.716.227 1.365.194 1.879.117.576-.085 1.767-.718 2.016-1.413.25-.694.25-1.288.175-1.412-.074-.124-.274-.197-.574-.347z"/>
        <path d="M12 21.996c-1.574 0-3.118-.4-4.472-1.157l-4.972 1.303 1.32-4.823A9.914 9.914 0 012.004 12C2.004 6.485 6.489 2 12 2s9.996 4.485 9.996 10-4.481 9.996-9.996 9.996z"/>
      </svg>
    )
  }
];

export default function FloatingSocials() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { updateCursor, resetCursor } = useCursor();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true); // Scrolling down
    } else {
      setHidden(false); // Scrolling up
    }
  });

  return (
    <motion.div
      variants={{
        visible: { opacity: 1, x: 0, y: 0 },
        hiddenDesktop: { opacity: 0, x: 20 },
        hiddenMobile: { opacity: 0, y: 50 }
      }}
      initial="visible"
      animate={hidden ? (isMobile ? 'hiddenMobile' : 'hiddenDesktop') : 'visible'}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed z-50 flex items-center justify-center 
                 bottom-6 left-1/2 -translate-x-1/2 flex-row gap-6 bg-surface/50 backdrop-blur-md px-8 py-4 rounded-full border border-white/5
                 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:right-8 md:translate-x-0 md:flex-col md:bg-transparent md:backdrop-blur-none md:border-none md:px-0 md:py-0"
    >
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noreferrer"
          className="text-text/50 hover:text-accent transition-colors duration-300 hover:scale-110 transform cursor-none"
          onMouseEnter={() => updateCursor({ active: true, text: 'GO' })}
          onMouseLeave={resetCursor}
          aria-label={social.name}
        >
          {social.svg}
        </a>
      ))}
    </motion.div>
  );
}
