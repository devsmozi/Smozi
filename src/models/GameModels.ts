import { BlockColorType } from './BlockColor.ts';
import { CellState } from './CellState.ts';
import { SpecialBlockType } from './SpecialBlockType.ts';

export enum GameMode {
  CLASSIC = 'CLASSIC',
  ADVENTURE = 'ADVENTURE',
  DAILY_CHALLENGE = 'DAILY_CHALLENGE'
}

export enum ObjectiveType {
  SCORE = 'SCORE',
  CLEAR_COLOR = 'CLEAR_COLOR',
  CLEAR_SPECIAL = 'CLEAR_SPECIAL',
  COLLECT_GEMS = 'COLLECT_GEMS',
  CLEAR_ALL = 'CLEAR_ALL'
}

export interface LevelObjective {
  type: ObjectiveType;
  targetAmount: number;
  currentAmount: number;
  targetColor?: BlockColorType;
  targetSpecial?: SpecialBlockType;
}

export interface LevelData {
  id: number;
  worldId: number;
  title: string;
  initialBoard: Record<string, CellState>; // key format "row,col"
  objective: LevelObjective;
  moveLimit: number;
  rewardCoins: number;
  rewardGems: number;
  starThresholds: [number, number, number];
  difficulty: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  currentProgress: number;
  targetValue: number;
  isUnlocked: boolean;
  rewardCoins: number;
  rewardGems: number;
}

export interface PlayerData {
  classicHighScore: number;
  coins: number;
  gems: number;
  lives: number;
  currentLevel: number;
  unlockedLevels: number[];
  levelStars: Record<number, number>;
  levelHighScores: Record<number, number>;
  dailyStreak: number;
  lastDailyClaimTimestamp: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  selectedTheme: string;
  achievements: Record<string, number>;
}

export const INITIAL_PLAYER_DATA: PlayerData = {
  classicHighScore: 0,
  coins: 1234,
  gems: 50,
  lives: 5,
  currentLevel: 1,
  unlockedLevels: [1],
  levelStars: {},
  levelHighScores: {},
  dailyStreak: 1,
  lastDailyClaimTimestamp: 0,
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  selectedTheme: 'Classic Navy',
  achievements: {}
};
