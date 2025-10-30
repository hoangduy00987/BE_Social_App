import { logger } from '../shared/logger.js';
import { createNotification, isEventProcessed, markEventProcessed } from '../modules/notifications/notificationRepo.js';
import { emitNotificationToUser } from '../realtime/websocket.js';

export type EventEnvelope = {
	eventId: string
	eventType: string
	occurredAt: string
	actor?: { userId: string; username?: string }
	target?: Record<string, unknown>
	context?: Record<string, unknown>
};

export async function routeEvent(evt: EventEnvelope) {
	if (!evt?.eventId || !evt?.eventType) return;
	if (await isEventProcessed(evt.eventId)) {
		return;
	}
	try {
		switch (evt.eventType) {
			case 'post.comment-created.v1':
				await handleCommentCreated(evt);
				break;
			default:
				logger.debug({ evt }, 'Unhandled eventType');
		}
		await markEventProcessed(evt.eventId);
	} catch (err) {
		logger.error({ err, evt }, 'Failed to process event');
		throw err;
	}
}

async function handleCommentCreated(evt: EventEnvelope) {
	// Assume context has ownerUserId of the post/comment owner to notify
	const ownerUserId = String((evt.target as any)?.ownerUserId ?? '');
	if (!ownerUserId) return;
	
	const notification = await createNotification({
		userId: ownerUserId,
		type: 'comment_created',
		title: 'New comment on your post',
		body: String((evt.context as any)?.snippet ?? 'Someone commented on your post'),
		metadata: { evt },
		isRead: false,
		dedupeKey: evt.eventId
	});

	// Emit real-time notification via WebSocket
	emitNotificationToUser(ownerUserId, notification);
}

