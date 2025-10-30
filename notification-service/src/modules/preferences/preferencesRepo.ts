import { UserPreference } from '@prisma/client';
import { getPrisma } from '../../shared/db.js';

export async function getPreferences(userId: string) {
	const prisma = getPrisma();
	return prisma.userPreference.findUnique({ where: { userId } });
}

export async function upsertPreferences(userId: string, prefs: Partial<UserPreference>) {
	const prisma = getPrisma();
	return prisma.userPreference.upsert({
		where: { userId },
		create: { userId, inApp: prefs.inApp ?? true, email: prefs.email ?? false, push: prefs.push ?? false, types: prefs.types ?? {}, quietHours: prefs.quietHours ?? {}, language: prefs.language ?? 'en' },
		update: { inApp: prefs.inApp, email: prefs.email, push: prefs.push, types: prefs.types, quietHours: prefs.quietHours, language: prefs.language }
	});
}
