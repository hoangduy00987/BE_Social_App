import { Router } from 'express';
import * as notifications from './controllers/notifications.controller.js';
import * as preferences from './controllers/preferences.controller.js';
import { NotificationService } from './services/notification.service.js';
import { emitNotificationToUser, getConnectedUsersCount } from './realtime/websocket.js';
import { authMiddleware } from './shared/middlewares/auth.middleware.js';

const notificationService = new NotificationService();

export function createRoutes() {
	const router = Router();

	// Public routes
	router.get('/health', (_req, res) => {
		res.json({ status: 'ok' });
	});

	router.get('/websocket/status', (_req, res) => {
		res.json({ 
			connectedUsers: getConnectedUsersCount(),
			status: 'active'
		});
	});

	// Test route 
	router.post('/test-event', authMiddleware, async (req, res) => {
		try {
			const { userId } = req.body;
			if (!userId) {
				return res.status(400).json({ error: 'userId required' });
			}

			// Create test notification
			const notification = await notificationService.createNotification({
				userId: userId,
				type: 'test_notification',
				title: 'Test WebSocket Notification',
				body: `This is a test notification sent at ${new Date().toISOString()}`,
				metadata: { test: true },
				isRead: false,
				dedupeKey: `test-${Date.now()}`
			});

			// Emit via WebSocket
			emitNotificationToUser(userId, notification);

			res.json({ 
				message: 'Test notification sent',
				notificationId: notification.id 
			});
		} catch (error) {
			res.status(500).json({ error: 'Failed to send test notification' });
		}
	});

	// Protected routes: yêu cầu access_token hợp lệ
	router.get('/notifications', authMiddleware, notifications.list);
	router.patch('/notifications/:id/read', authMiddleware, notifications.markRead);
	router.patch('/notifications/read-all', authMiddleware, notifications.markAll);

	router.get('/preferences', authMiddleware, preferences.get);
	router.put('/preferences', authMiddleware, preferences.put);

	return router;
}

