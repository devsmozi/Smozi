import { Achievement } from '../models/GameModels.ts';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Win',
    description: 'Complete your first adventure level',
    targetValue: 1,
    currentProgress: 0,
    isUnlocked: false,
    rewardCoins: 100,
    rewardGems: 1
  },
  {
    id: 'block_master',
    title: 'Block Master',
    description: 'Place 100 blocks on the game board',
    targetValue: 100,
    currentProgress: 0,
    isUnlocked: false,
    rewardCoins: 150,
    rewardGems: 2
  },
  {
    id: 'line_crusher',
    title: 'Line Crusher',
    description: 'Clear 30 rows or columns',
    targetValue: 30,
    currentProgress: 0,
    isUnlocked: false,
    rewardCoins: 200,
    rewardGems: 2
  },
  {
    id: 'combo_master',
    title: 'Combo Master',
    description: 'Achieve a 4x combo in a single match',
    targetValue: 4,
    currentProgress: 0,
    isUnlocked: false,
    rewardCoins: 300,
    rewardGems: 3
  },
  {
    id: 'gem_collector',
    title: 'Gem Collector',
    description: 'Collect 20 gems from puzzle clearing',
    targetValue: 20,
    currentProgress: 0,
    isUnlocked: false,
    rewardCoins: 250,
    rewardGems: 5
  },
  {
    id: 'adventure_explorer',
    title: 'Adventure Explorer',
    description: 'Reach Level 10 in Adventure Mode',
    targetValue: 10,
    currentProgress: 0,
    isUnlocked: false,
    rewardCoins: 500,
    rewardGems: 5
  },
  {
    id: 'perfect_puzzler',
    title: 'Perfect Puzzler',
    description: 'Earn 3 stars on 5 different levels',
    targetValue: 5,
    currentProgress: 0,
    isUnlocked: false,
    rewardCoins: 400,
    rewardGems: 4
  },
  {
    id: 'high_scorer',
    title: 'High Scorer',
    description: 'Score over 2000 points in Classic Mode',
    targetValue: 2000,
    currentProgress: 0,
    isUnlocked: false,
    rewardCoins: 600,
    rewardGems: 10
  }
];

export interface DailyRewardItem {
  day: number;
  title: string;
  coins: number;
  gems: number;
  specialBonus?: string;
}

export const DAILY_REWARDS_DATA: DailyRewardItem[] = [
  { day: 1, title: 'Day 1', coins: 100, gems: 0 },
  { day: 2, title: 'Day 2', coins: 0, gems: 1 },
  { day: 3, title: 'Day 3', coins: 200, gems: 0 },
  { day: 4, title: 'Day 4', coins: 150, gems: 1, specialBonus: 'Rocket Power-Up' },
  { day: 5, title: 'Day 5', coins: 0, gems: 2, specialBonus: 'Color Ball' },
  { day: 6, title: 'Day 6', coins: 250, gems: 2 },
  { day: 7, title: 'Day 7', coins: 500, gems: 5, specialBonus: 'Super Chest' }
];
