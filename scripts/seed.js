import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function seed() {
  console.log('Seeding initial admin account...');
  
  const email = 'admin@havilah.studio';
  const password = 'AdminPassword123!';
  
  const existingAdmin = await db.admin.findUnique({
    where: { email }
  });

  if (existingAdmin) {
    console.log(`Admin ${email} already exists.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await db.admin.create({
    data: {
      email,
      passwordHash,
      role: 'superadmin'
    }
  });

  console.log(`Created admin account for ${admin.email}`);
  console.log('IMPORTANT: Please change this password immediately after logging in.');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
