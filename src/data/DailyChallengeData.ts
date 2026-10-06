import { BlockColorType } from '../models/BlockColor.ts';
import { CellState } from '../models/CellState.ts';
import { LevelData, LevelObjective, ObjectiveType } from '../models/GameModels.ts';
import { SpecialBlockType } from '../models/SpecialBlockType.ts';

function createBoardCell(
  color: BlockColorType = BlockColorType.NONE,
  special: SpecialBlockType = SpecialBlockType.NONE
): CellState {
  return {
    row: 0,
    col: 0,
    isOccupied: true,
    color,
    specialType: special,
    durability: special === SpecialBlockType.ICE ? 2 : 1
  };
}

export interface DailyStageConfig extends LevelData {
  stageNumber: number; // 1, 2, or 3
  stageDifficultyLabel?: string;
  appreciationQuote: string;
  objective: LevelObjective;
  moveLimit: number;
}

export function getDailyChallengeStages(): DailyStageConfig[] {
  return [
    {
      id: 1001,
      worldId: 99,
      stageNumber: 1,
      title: 'Daily Stage 1',
      appreciationQuote: 'Splendid Start! You made quick work of the initial grid!',
      initialBoard: {},
      objective: {
        type: ObjectiveType.CLEAR_COLOR,
        targetAmount: 12,
        currentAmount: 0,
        targetColor: BlockColorType.RED
      },
      moveLimit: 22,
      starThresholds: [400, 800, 1200],
      rewardCoins: 120,
      rewardGems: 1,
      difficulty: 'Simple'
    },
    {
      id: 1002,
      worldId: 99,
      stageNumber: 2,
      title: 'Daily Stage 2',
      appreciationQuote: 'Outstanding Strategy! Your gem hunting instincts are brilliant!',
      initialBoard: {
        '2,2': createBoardCell(BlockColorType.BLUE, SpecialBlockType.GEM_BLUE),
        '2,5': createBoardCell(BlockColorType.BLUE, SpecialBlockType.GEM_BLUE),
        '5,2': createBoardCell(BlockColorType.RED, SpecialBlockType.GEM_RED),
        '5,5': createBoardCell(BlockColorType.RED, SpecialBlockType.GEM_RED)
      },
      objective: {
        type: ObjectiveType.COLLECT_GEMS,
        targetAmount: 4,
        currentAmount: 0
      },
      moveLimit: 18,
      starThresholds: [700, 1200, 1800],
      rewardCoins: 200,
      rewardGems: 2,
      difficulty: 'Medium'
    },
    {
      id: 1003,
      worldId: 99,
      stageNumber: 3,
      title: 'Daily Stage 3',
      appreciationQuote: 'PHENOMENAL MASTERY! You completely conquered today\'s hardest trial with sheer puzzle brilliance!',
      initialBoard: {
        '1,1': createBoardCell(BlockColorType.NONE, SpecialBlockType.STONE),
        '1,6': createBoardCell(BlockColorType.NONE, SpecialBlockType.STONE),
        '6,1': createBoardCell(BlockColorType.NONE, SpecialBlockType.STONE),
        '6,6': createBoardCell(BlockColorType.NONE, SpecialBlockType.STONE),
        '3,3': createBoardCell(BlockColorType.NONE, SpecialBlockType.BOMB),
        '4,4': createBoardCell(BlockColorType.NONE, SpecialBlockType.BOMB)
      },
      objective: {
        type: ObjectiveType.CLEAR_SPECIAL,
        targetAmount: 2,
        currentAmount: 0,
        targetSpecial: SpecialBlockType.BOMB
      },
      moveLimit: 16,
      starThresholds: [1000, 1600, 2400],
      rewardCoins: 400,
      rewardGems: 5,
      difficulty: 'Hard'
    }
  ];
}
