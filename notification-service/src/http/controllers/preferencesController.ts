import { Request, Response } from 'express';
import * as repo from '../../modules/preferences/preferencesRepo.js';

/**
 * @swagger
 * /preferences:
 *   get:
 *     summary: Lấy cài đặt người dùng
 *     tags: [Preferences]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Cài đặt người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreference'
 *       400:
 *         description: Lỗi validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function get(req: Request, res: Response) {
	const userId = (req.query.userId as string) ?? '';
	if (!userId) return res.status(400).json({ error: 'userId required' });
	const prefs = await repo.getPreferences(userId);
	res.json(prefs ?? { userId, inApp: true, email: false, push: false, types: {}, quietHours: {}, language: 'en' });
}

/**
 * @swagger
 * /preferences:
 *   put:
 *     summary: Cập nhật cài đặt người dùng
 *     tags: [Preferences]
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
 *               inApp:
 *                 type: boolean
 *                 description: Nhận thông báo in-app
 *               email:
 *                 type: boolean
 *                 description: Nhận thông báo email
 *               push:
 *                 type: boolean
 *                 description: Nhận push notifications
 *               language:
 *                 type: string
 *                 description: Ngôn ngữ
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: Cài đặt đã cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreference'
 *       400:
 *         description: Lỗi validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function put(req: Request, res: Response) {
	const userId = (req.body.userId as string) ?? '';
	if (!userId) return res.status(400).json({ error: 'userId required' });
	const updated = await repo.upsertPreferences(userId, req.body);
	res.json(updated);
}
