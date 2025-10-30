import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { env } from '../shared/env.js';
import { logger } from '../shared/logger.js';

let io: SocketIOServer | undefined;

export function setupWebSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.corsOrigins.length > 0 ? env.corsOrigins : '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, 'User connected to WebSocket');

    // Join user to their personal room
    socket.on('join-user-room', (userId: string) => {
      if (!userId) {
        socket.emit('error', { message: 'userId is required' });
        return;
      }

      socket.join(`user:${userId}`);
      logger.info({ socketId: socket.id, userId }, 'User joined personal room');
      socket.emit('joined-room', { userId });
    });

    // Leave user room
    socket.on('leave-user-room', (userId: string) => {
      socket.leave(`user:${userId}`);
      logger.info({ socketId: socket.id, userId }, 'User left personal room');
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info({ socketId: socket.id, reason }, 'User disconnected from WebSocket');
    });

    // Error handling
    socket.on('error', (error) => {
      logger.error({ socketId: socket.id, error }, 'WebSocket error');
    });
  });

  logger.info('WebSocket server initialized');
  return io;
}

export function getIO(): SocketIOServer | undefined {
  return io;
}

// Helper function to emit notification to specific user
export function emitNotificationToUser(userId: string, notification: any) {
  if (!io) {
    logger.warn('WebSocket server not initialized');
    return;
  }

  io.to(`user:${userId}`).emit('notification', {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    metadata: notification.metadata,
    createdAt: notification.createdAt
  });

  logger.info({ userId, notificationId: notification.id }, 'Notification emitted via WebSocket');
}

// Helper function to emit notification updates to specific user
export function emitNotificationUpdateToUser(userId: string, notificationId: string, updates: any) {
  if (!io) {
    logger.warn('WebSocket server not initialized');
    return;
  }

  io.to(`user:${userId}`).emit('notification:updated', {
    notificationId,
    updates
  });

  logger.info({ userId, notificationId, updates }, 'Notification update emitted via WebSocket');
}

// Helper function to emit to all connected users
export function emitToAll(event: string, data: any) {
  if (!io) {
    logger.warn('WebSocket server not initialized');
    return;
  }

  io.emit(event, data);
  logger.info({ event }, 'Message emitted to all connected users');
}

// Helper function to get connected users count
export function getConnectedUsersCount(): number {
  if (!io) {
    return 0;
  }

  return io.engine.clientsCount;
}
