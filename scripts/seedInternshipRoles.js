import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const roles = [
  {
    roleName: 'Frontend Developer',
    department: 'Engineering',
    duration: '6 Months',
    openings: 2,
    description: 'Build immersive, cinematic user interfaces using React, Framer Motion, and WebGL.',
    status: 'open'
  },
  {
    roleName: 'Video Editor',
    department: 'Post-Production',
    duration: '3 Months',
    openings: 1,
    description: 'Craft compelling narratives through cutting-edge video editing and color grading techniques.',
    status: 'open'
  },
  {
    roleName: 'Graphic Designer',
    department: 'Design',
    duration: 'Project-Based',
    openings: 3,
    description: 'Create stunning brand identities, editorial layouts, and visual assets for high-end clients.',
    status: 'open'
  },
  {
    roleName: 'Photography Intern',
    department: 'Production',
    duration: '4 Months',
    openings: 0,
    description: 'Assist in premium photoshoots, lighting setups, and editorial direction.',
    status: 'closed'
  }
];

async function main() {
  console.log('Seeding internship roles...');
  
  // Clear existing roles to prevent duplicates
  await prisma.internshipRole.deleteMany();

  for (const role of roles) {
    await prisma.internshipRole.create({
      data: role
    });
  }

  console.log('Successfully seeded 4 internship roles.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
