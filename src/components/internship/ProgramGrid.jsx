import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ProgramCard from './ProgramCard';

const iconMap = {
  'Engineering': <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>,
  'Post-Production': <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>,
  'Design': <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
  'Production': <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
  'Default': <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
};

export default function ProgramGrid({ onApply }) {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch('/api/internship-roles');
        if (!res.ok) throw new Error('Failed to fetch internship roles');
        const result = await res.json();
        
        if (result.success && Array.isArray(result.data)) {
          // Add icon component dynamically
          const rolesWithIcons = result.data.map(role => ({
            ...role,
            icon: iconMap[role.department] || iconMap['Default']
          }));
          setPrograms(rolesWithIcons);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error('Error fetching roles:', err);
        setError('Failed to load opportunities. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoles();
  }, []);

  return (
    <div id="open-opportunities" className="w-full py-32 bg-primary px-6 md:px-12 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center relative"
        >
          {/* Decorative SVG Crosses */}
          <svg className="absolute -left-8 -top-8 w-6 h-6 text-white/20 hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2v20M2 12h20" strokeWidth="1" />
          </svg>
          <svg className="absolute -right-8 -bottom-8 w-6 h-6 text-accent/30 hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2v20M2 12h20" strokeWidth="1" />
          </svg>

          <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tight mb-4">Available Opportunities</h2>
          <p className="text-white/50 font-sans font-light max-w-xl">
            Select a discipline below to begin your application. We review portfolios on a rolling basis.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 2v4m0 12v4m10-10h-4M6 12H2M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83M19.07 19.07l-2.83-2.83M7.76 7.76L4.93 4.93"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10 font-mono text-sm">{error}</div>
        ) : programs.length === 0 ? (
          <div className="text-center text-white/50 py-10 font-mono text-sm">No roles currently open. Check back later.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program, index) => (
              <motion.div
                key={program.title + index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <ProgramCard program={program} onApply={onApply} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
