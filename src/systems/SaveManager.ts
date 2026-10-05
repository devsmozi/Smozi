import { INITIAL_PLAYER_DATA, PlayerData } from '../models/GameModels.ts';

const STORAGE_KEY = 'smozi_game_save_v1';

export class SaveManager {
  loadPlayerData(): PlayerData {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...INITIAL_PLAYER_DATA };
    }
    try {
      const dataStr = window.localStorage.getItem(STORAGE_KEY);
      if (!dataStr) {
        return { ...INITIAL_PLAYER_DATA };
      }
      const parsed = JSON.parse(dataStr);
      return {
        ...INITIAL_PLAYER_DATA,
        ...parsed,
        levelStars: parsed.levelStars || {},
        levelHighScores: parsed.levelHighScores || {},
        achievements: parsed.achievements || {}
      };
    } catch {
      return { ...INITIAL_PLAYER_DATA };
    }
  }

  savePlayerData(data: PlayerData): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }
}
