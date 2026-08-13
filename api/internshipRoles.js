import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const roles = await prisma.internshipRole.findMany({
      where: {
        isDeleted: false
      },
      orderBy: {
        roleId: 'desc'
      }
    });

    // Map the database structure to the frontend format
    const formattedRoles = roles.map(role => ({
      title: role.roleName,
      department: role.department,
      description: role.description,
      isOpen: role.status === 'open',
      metadata: {
        startDate: 'Rolling / TBD',
        duration: role.duration,
        location: 'Hybrid / Remote', 
        slots: role.openings === 0 ? 'Closed' : `${role.openings} Positions`
      }
    }));

    return res.status(200).json({ success: true, data: formattedRoles });
  } catch (error) {
    console.error('[API/InternshipRoles] Error fetching roles:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
