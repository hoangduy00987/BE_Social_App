import * as notificationRepo from "../repositories/notification.repository.js";
import { emitNotificationUpdateToUser } from "../realtime/websocket.js";
import { Prisma, Notification } from "@prisma/client";

export class NotificationService {
  async listNotifications(
    userId: string,
    limit = 20,
    cursor?: string
  ) {
    return notificationRepo.listNotifications(userId, limit, cursor);
  }

  async markNotificationRead(userId: string, id: string) {
    const notification = await notificationRepo.markNotificationRead(userId, id);
    
    // Emit real-time update via WebSocket
    emitNotificationUpdateToUser(userId, id, { read: true });
    
    return notification;
  }

  async markAllRead(userId: string) {
    await notificationRepo.markAllRead(userId);
    
    // Emit real-time update for all notifications
    emitNotificationUpdateToUser(userId, 'all', { read: true });
  }

  async createNotification(
    data: Prisma.NotificationCreateInput
  ): Promise<Notification> {
    return notificationRepo.createNotification(data);
  }

  async isEventProcessed(eventId: string) {
    return notificationRepo.isEventProcessed(eventId);
  }

  async markEventProcessed(eventId: string) {
    return notificationRepo.markEventProcessed(eventId);
  }
}

