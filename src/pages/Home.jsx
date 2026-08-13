import { Helmet } from 'react-helmet-async';
import SEO from '../components/common/SEO';
import Hero from '../components/Hero';
import Showreel from '../components/home/Showreel';
import FeaturedProjects from '../components/home/FeaturedProjects';
import AboutSection from '../components/home/AboutSection';
import ServicesPreview from '../components/home/ServicesPreview';
import ClientsMarquee from '../components/home/ClientsMarquee';
import Testimonials from '../components/home/Testimonials';
import ContactCTA from '../components/home/ContactCTA';

export default function Home() { 
  return (
    <>
      <SEO 
        title="Havilah | Photography, Digital Media & Ad Video Production" 
        path="/" 
      />
      
      <Helmet>
        <link rel="preload" as="video" href="/videos/Havilah-Hero.mp4" type="video/mp4" fetchpriority="high" />
      </Helmet>
      
      <Hero />
      <Showreel />
      <FeaturedProjects />
      <AboutSection />
      <ServicesPreview />
      <ClientsMarquee />
      <Testimonials />
      <ContactCTA />

    </>
  ); 
}
