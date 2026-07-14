import { motion } from 'framer-motion';

const clients = [
  "Netflix", "HBO", "A24", "Nike", "Apple", "Vogue", "Sony", "BMW",
  "Netflix", "HBO", "A24", "Nike", "Apple", "Vogue", "Sony", "BMW"
];

export default function ClientsMarquee() {
  return (
    <section className="py-24 bg-bg w-full overflow-hidden border-y border-white/5">
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {clients.map((client, idx) => (
          <div key={idx} className="inline-flex items-center mx-12">
            <span className="text-4xl md:text-6xl font-bold font-display tracking-wide tracking-tighter text-white/20 uppercase">
              {client}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
