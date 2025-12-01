import * as preferencesRepo from "../repositories/preferences.repository.js";
import { UserPreference } from "@prisma/client";

export class PreferencesService {
  async getPreferences(userId: string) {
    const prefs = await preferencesRepo.getPreferences(userId);
    return prefs ?? {
      userId,
      inApp: true,
      email: false,
      push: false,
      types: {},
      quietHours: {},
      language: 'en'
    };
  }

  async upsertPreferences(
    userId: string,
    prefs: Partial<UserPreference>
  ) {
    return preferencesRepo.upsertPreferences(userId, prefs);
  }
}

