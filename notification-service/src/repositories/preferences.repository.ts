import { UserPreference } from "@prisma/client";
import { getPrisma } from "../shared/db.js";
import { toJson } from "../shared/utils.js";

export async function getPreferences(userId: string) {
  const prisma = getPrisma();
  return prisma.userPreference.findUnique({ where: { userId } });
}

export async function upsertPreferences(
  userId: string,
  prefs: Partial<UserPreference>
) {
  const prisma = getPrisma();
  return prisma.userPreference.upsert({
    where: { userId },
    create: {
      userId,
      inApp: prefs.inApp ?? true,
      email: prefs.email ?? false,
      push: prefs.push ?? false,
      types: toJson(prefs.types) ?? {},
      quietHours: toJson(prefs.quietHours) ?? {},
      language: prefs.language ?? "en",
    },
    update: {
      inApp: prefs.inApp,
      email: prefs.email,
      push: prefs.push,
      types: toJson(prefs.types),
      quietHours: toJson(prefs.quietHours),
      language: prefs.language,
    },
  });
}

