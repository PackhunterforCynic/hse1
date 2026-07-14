import { Helmet } from 'react-helmet-async';
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
      <Helmet>
        <title>havilah | Media & Growth</title>
        <meta name="description" content="We create cinematic films, memorable brands and digital experiences that leave lasting impressions." />
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
