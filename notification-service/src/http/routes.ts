import { Router } from 'express';
import * as notifications from './controllers/notificationsController.js';
import * as preferences from './controllers/preferencesController.js';
import { getConnectedUsersCount, emitNotificationToUser, emitNotificationUpdateToUser } from '../realtime/websocket.js';
import { createNotification } from '../modules/notifications/notificationRepo.js';

export function createRoutes() {
	const router = Router();

	router.get('/health', (_req, res) => {
		res.json({ status: 'ok' });
	});

	router.get('/websocket/status', (_req, res) => {
		res.json({ 
			connectedUsers: getConnectedUsersCount(),
			status: 'active'
		});
	});

	router.post('/test-event', async (req, res) => {
		try {
			const { userId } = req.body;
			if (!userId) {
				return res.status(400).json({ error: 'userId required' });
			}

			// Create test notification
			const notification = await createNotification({
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

	router.get('/notifications', notifications.list);
	router.patch('/notifications/:id/read', notifications.markRead);
	router.patch('/notifications/read-all', notifications.markAll);

	router.get('/preferences', preferences.get);
	router.put('/preferences', preferences.put);

	return router;
}
