import { requireAdminId, logout } from './session.server';
import { db } from './db.server';

/**
 * Middleware for Admin routes.
 * Ensures the user is logged in, exists in the database, and is not deleted.
 */
export async function requireAdminSession(request) {
  const adminId = await requireAdminId(request);

  const admin = await db.admin.findUnique({
    where: { id: adminId },
    select: { id: true, email: true, role: true, isDeleted: true },
  });

  if (!admin || admin.isDeleted) {
    throw await logout(request);
  }

  return admin;
}

/**
 * Superadmin specific middleware
 */
export async function requireSuperAdmin(request) {
  const admin = await requireAdminSession(request);
  
  if (admin.role !== 'superadmin') {
    throw new Response("Forbidden: Requires Superadmin role", { status: 403 });
  }

  return admin;
}

/**
 * Activity Logger Helper
 */
export async function logAdminAction(adminId, action, entity, entityId = null, request = null) {
  const ipAddress = request?.headers.get('x-forwarded-for') || null;
  const browserHeader = request?.headers.get('user-agent') || null;
  const browser = browserHeader ? browserHeader.substring(0, 255) : null;

  await db.activityLog.create({
    data: {
      adminId,
      action,
      entity,
      entityId,
      ipAddress,
      browser
    }
  });
}
