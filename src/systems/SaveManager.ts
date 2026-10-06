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

  exportSaveString(): string {
    const data = this.loadPlayerData();
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    } catch {
      return JSON.stringify(data);
    }
  }

  importSaveString(code: string): PlayerData | null {
    try {
      let jsonStr = code.trim();
      try {
        jsonStr = decodeURIComponent(escape(atob(jsonStr)));
      } catch {}
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed !== 'object' || parsed === null) return null;
      const merged: PlayerData = {
        ...INITIAL_PLAYER_DATA,
        ...parsed,
        levelStars: parsed.levelStars || {},
        levelHighScores: parsed.levelHighScores || {},
        achievements: parsed.achievements || {}
      };
      this.savePlayerData(merged);
      return merged;
    } catch {
      return null;
    }
  }

  resetPlayerData(): PlayerData {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    return { ...INITIAL_PLAYER_DATA };
  }
}
