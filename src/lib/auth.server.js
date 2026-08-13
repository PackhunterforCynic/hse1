import bcrypt from 'bcryptjs';
import { db } from './db.server';

export async function login({ email, password }) {
  const admin = await db.admin.findUnique({
    where: { email },
  });

  if (!admin || admin.isDeleted) {
    return null;
  }

  const isPasswordCorrect = await bcrypt.compare(password, admin.passwordHash);

  if (!isPasswordCorrect) {
    return null;
  }

  // Update last login
  await db.admin.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() },
  });

  return { id: admin.id, email: admin.email, role: admin.role };
}

export async function createAdmin({ email, password, role = 'admin' }) {
  const passwordHash = await bcrypt.hash(password, 10);

  return db.admin.create({
    data: {
      email,
      passwordHash,
      role,
    },
  });
}

export async function verifyAdminRole(adminId, requiredRole = 'admin') {
  const admin = await db.admin.findUnique({
    where: { id: adminId },
    select: { role: true },
  });

  if (!admin) return false;
  
  if (requiredRole === 'superadmin' && admin.role !== 'superadmin') {
    return false;
  }
  
  return true;
}
