import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding initial 3 services...");

  const services = [
    {
      serviceName: "Film Production",
      slug: "film-production",
      description: "Comprehensive cinematic storytelling across three core categories: Ad films for brand campaigns, narrative Short films, and impactful Documentary films.",
      icon: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
      category: "Service 01",
      featured: true,
      status: "active"
    },
    {
      serviceName: "Photography",
      slug: "photography",
      description: "Editorial and brand photography with a sharp, distinctive visual language built for print, deck, and digital spaces.",
      icon: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
      category: "Service 02",
      featured: true,
      status: "active"
    },
    {
      serviceName: "Digital Marketing",
      slug: "digital-marketing",
      description: "End-to-end digital growth solutions including robust Web Development, strategic Brand Development, and targeted Social Media Marketing.",
      icon: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
      category: "Service 03",
      featured: true,
      status: "active"
    }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }

  console.log("Services seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
