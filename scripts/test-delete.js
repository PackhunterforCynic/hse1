import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testDelete() {
  try {
    const service = await prisma.service.update({
      where: { serviceId: 1 },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    console.log("Success:", service);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
testDelete();
