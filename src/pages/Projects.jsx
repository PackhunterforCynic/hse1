import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/common/SEO';
import { projects } from '../data/projects';
import { useLanguage } from '../i18n';
import GsapButton from '../components/common/GsapButton';
import GsapScrollReveal from '../components/common/GsapScrollReveal';

export default function Projects() {
  const { t } = useLanguage();

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-4 md:px-8 xl:px-12 max-w-7xl mx-auto overflow-hidden">
      <SEO 
        title="Havilah | Projects" 
        description="View our extensive portfolio of world-class ad videos, documentaries, corporate shoots, and high-end commercial photography."
        path="/projects"
      />

      <div className="mb-16 md:mb-24">
        <GsapScrollReveal mode="text" className="text-5xl md:text-8xl font-display uppercase tracking-tighter mb-6 block">
          {t('projectsPage.ourWork') || "Our Works"}
        </GsapScrollReveal>
        <GsapScrollReveal mode="fade" direction="up" delay={0.2} className="text-xl font-serif italic text-white/80 max-w-2xl">
          {t('projectsPage.curatedDesc') || "A curated selection of our finest cinematic storytelling and brand experiences."}
        </GsapScrollReveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
        {projects.map((project, index) => (
          <div key={project.id} className="flex flex-col gap-4">
            <GsapScrollReveal mode="image" delay={(index % 2) * 0.15} className="w-full rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-md">
              <Link to={`/projects/${project.id}`} className="group block relative overflow-hidden aspect-[4/3]">
                <img 
                  data-src={project.cover} 
                  alt={project.title}
                  className="lazyload w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-105 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-accent font-mono text-xs tracking-widest uppercase mb-2">
                    {project.category}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-heading uppercase tracking-wider text-white group-hover:text-accent transition-colors">
                    {project.title}
                  </h2>
                </div>
              </Link>
            </GsapScrollReveal>
            <GsapButton to={`/projects/${project.id}`} variant="outline" className="w-full justify-center text-xs tracking-widest py-3">
              {t('home.exploreProject') || "Explore Project"} →
            </GsapButton>
          </div>
        ))}
      </div>
    </div>
  );
}

