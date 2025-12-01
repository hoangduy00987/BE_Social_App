import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service.js';

const notificationService = new NotificationService();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Lấy danh sách thông báo
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Số lượng thông báo tối đa
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Con trỏ phân trang
 *     responses:
 *       200:
 *         description: Danh sách thông báo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 nextCursor:
 *                   type: string
 *       400:
 *         description: Lỗi validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function list(req: Request, res: Response) {
	const authUser = (req as any).user as { id?: number } | undefined;
	const userId =
		(req.query.userId as string) ??
		(authUser?.id != null ? String(authUser.id) : '');

	if (!userId) {
		return res.status(400).json({ error: 'userId required' });
	}
	const limit = Number(req.query.limit ?? 20);
	const cursor = (req.query.cursor as string) || undefined;
	const result = await notificationService.listNotifications(userId, Math.min(limit, 100), cursor);
	res.json(result);
}

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Đánh dấu thông báo đã đọc
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thông báo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người dùng
 *             required:
 *               - userId
 *     responses:
 *       204:
 *         description: Thành công
 *       400:
 *         description: Lỗi validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function markRead(req: Request, res: Response) {
	const authUser = (req as any).user as { id?: number } | undefined;
	const userId =
		(req.body.userId as string) ??
		(authUser?.id != null ? String(authUser.id) : '');
	const id = req.params.id;
	if (!userId) {
		return res.status(400).json({ error: 'userId required' });
	}
	
	await notificationService.markNotificationRead(userId, id);
	
	res.status(204).end();
}

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Đánh dấu tất cả thông báo đã đọc
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người dùng
 *             required:
 *               - userId
 *     responses:
 *       204:
 *         description: Thành công
 *       400:
 *         description: Lỗi validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function markAll(req: Request, res: Response) {
	const authUser = (req as any).user as { id?: number } | undefined;
	const userId =
		(req.body.userId as string) ??
		(authUser?.id != null ? String(authUser.id) : '');

	if (!userId) {
		return res.status(400).json({ error: 'userId required' });
	}
	
	await notificationService.markAllRead(userId);
	
	res.status(204).end();
}

