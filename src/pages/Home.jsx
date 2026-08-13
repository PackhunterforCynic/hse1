import { useLoaderData } from 'react-router';
import { db } from '../lib/db.server';
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

export async function loader() {
  const testimonials = await db.testimonial.findMany({
    where: { 
      approved: true, 
      isDeleted: false,
      featured: true
    },
    orderBy: { createdAt: 'desc' }
  });
  return { testimonials };
}

export default function Home() { 
  const { testimonials } = useLoaderData();

  return (
    <>
      <SEO 
        title="Havilah | Media & Growth" 
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
      <Testimonials testimonials={testimonials} />
      <ContactCTA />

    </>
  ); 
}
