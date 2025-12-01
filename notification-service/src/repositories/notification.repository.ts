import { Prisma, Notification } from "@prisma/client";
import { getPrisma } from "../shared/db.js";

export async function listNotifications(
  userId: string,
  limit = 20,
  cursor?: string
) {
  const prisma = getPrisma();
  const where: Prisma.NotificationWhereInput = { userId };
  const results = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
  });
  const hasMore = results.length > limit;
  const items = hasMore ? results.slice(0, -1) : results;
  const nextCursor = hasMore ? items[items.length - 1]?.id ?? null : null;
  return { items, nextCursor } as const;
}

export async function markNotificationRead(userId: string, id: string) {
  const prisma = getPrisma();
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllRead(userId: string) {
  const prisma = getPrisma();
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function createNotification(
  data: Prisma.NotificationCreateInput
): Promise<Notification> {
  const prisma = getPrisma();
  return prisma.notification.create({ data });
}

export async function isEventProcessed(eventId: string) {
  const prisma = getPrisma();
  const found = await prisma.processedEvent.findUnique({ where: { eventId } });
  return Boolean(found);
}

export async function markEventProcessed(eventId: string) {
  const prisma = getPrisma();
  await prisma.processedEvent.create({ data: { eventId } });
}

