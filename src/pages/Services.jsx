import { Helmet } from 'react-helmet-async';
import SEO from '../components/common/SEO';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import { useLanguage } from '../i18n';
import GsapButton from '../components/common/GsapButton';
import { GradientShimmer } from '@/components/ui/gradient-shimmer';

export default function Services() {
  const containerRef = useRef(null);
  const { updateCursor, resetCursor } = useCursor();
  const { t } = useLanguage();

  const servicesData = [
    {
      title: t('servicesList.filmProduction') || "Film Production",
      desc: "Comprehensive cinematic storytelling across three core categories: Ad films for brand campaigns, narrative Short films, and impactful Documentary films.",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: t('servicesList.photography') || "Photography",
      desc: "Editorial and brand photography with a sharp, distinctive visual language built for print, deck, and digital spaces.",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: t('servicesList.digitalMarketing') || "Digital Marketing",
      desc: "End-to-end digital growth solutions including robust Web Development, strategic Brand Development, and targeted Social Media Marketing.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop"
    }
  ];

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#080808] text-[#F8F5F0] pt-40 pb-32 overflow-hidden relative">
      <SEO 
        title="Havilah | Services" 
        description="Explore our elite services in Commercial Photography, Ad Video Production, and Digital Media Strategy to elevate your brand."
        path="/services"
      />

      {/* Ambient radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[800px] bg-[#C9A84C]/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 z-0" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#C9A84C]/5 rounded-full blur-[150px] pointer-events-none translate-y-1/2 z-0" />
      
      {/* Film grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} 
      />

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <div className="mb-32 md:mb-48 max-w-5xl">
          <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-serif text-[#F8F5F0] tracking-tighter mb-8 leading-[0.9] block">
            <GradientShimmer gradient="sunrise" duration={2.5}>{t('servicesList.capabilities') || "Capabilities"}</GradientShimmer>
          </h2>
          <p className="text-xl md:text-2xl text-[rgba(255,255,255,0.75)] font-sans font-light leading-relaxed max-w-2xl pl-4 border-l-2 border-[#C9A84C]">
            {t('servicesList.capabilitiesDesc') || "We engineer premium visual experiences for luxury brands and cinematic storytellers."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-28 md:gap-y-32">
          {servicesData.map((service, idx) => (
            <div 
              key={idx}
              className="group relative bg-[#121212]/90 rounded-[24px] md:rounded-[32px] p-6 md:p-8 lg:p-10 border border-[#C9A84C]/15 backdrop-blur-xl transition-all duration-500 hover:border-[#C9A84C]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col cursor-none mt-16 md:mt-24"
              onMouseEnter={() => updateCursor({ active: true, text: 'EXPLORE' })}
              onMouseLeave={resetCursor}
            >
              <div className="relative -mt-24 md:-mt-32 lg:-mt-40 mb-8 w-full aspect-[4/3] z-10 transition-transform duration-500 group-hover:-translate-y-3">
                 <div 
                   className="w-full h-full overflow-hidden border border-[#C9A84C]/20 shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative transition-all duration-500 group-hover:shadow-[0_30px_60px_rgba(201,168,76,0.25)] group-hover:border-[#C9A84C]/60"
                   style={{ borderRadius: '0 48px 0 48px' }}
                 >
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]" 
                    />
                    {/* Soft gold gradient overlay revealed on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#C9A84C]/40 via-[#C9A84C]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                 </div>
              </div>

              <div className="relative z-20 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-[#C9A84C] font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4 md:mb-6 font-semibold">
                    Service {String(idx + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-serif text-[#F8F5F0] mb-4 group-hover:text-[#C9A84C] transition-colors duration-500 tracking-tight">
                    <GradientShimmer gradient="tonic" duration={1.8}>{service.title}</GradientShimmer>
                  </h3>
                  <p className="text-[rgba(255,255,255,0.7)] font-sans font-light leading-relaxed text-sm md:text-base mb-8">
                    {service.desc}
                  </p>
                </div>
                
                <GsapButton to="/contact" variant="outline" className="w-full justify-center text-xs tracking-[0.2em] py-3.5 mt-auto border-white/15 md:hover:border-[#C9A84C]">
                  {t('home.startConversation') || "Inquire Now"} ↗
                </GsapButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
