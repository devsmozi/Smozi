import { BlockColorType } from '../models/BlockColor.ts';
import { CellState } from '../models/CellState.ts';
import { LevelData, ObjectiveType } from '../models/GameModels.ts';
import { SpecialBlockType } from '../models/SpecialBlockType.ts';
import { TargetConfig } from '../models/TargetModels.ts';

function obstacle(
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

function target(row: number, column: number, type: string = 'diamond', visualAsset?: string): TargetConfig {
  return { row, column, type, visualAsset };
}

/**
 * Generates fair, validated, reachable target positions for a level board.
 * Ensures targets are placed strictly within grid boundaries and never on top
 * of immovable obstacle blocks.
 */
function generatePatternTargets(
  boardSize: number,
  count: number,
  types: string[],
  initialBoard: Record<string, CellState> = {},
  seed: number = 1
): TargetConfig[] {
  const result: TargetConfig[] = [];
  const occupiedSet = new Set(Object.keys(initialBoard));

  const candidateCoords: [number, number][] = [];
  const minCoord = 1;
  const maxCoord = boardSize - 2;

  for (let r = minCoord; r <= maxCoord; r++) {
    for (let c = minCoord; c <= maxCoord; c++) {
      if (!occupiedSet.has(`${r},${c}`)) {
        candidateCoords.push([r, c]);
      }
    }
  }

  // Deterministic shuffle using level seed
  for (let i = candidateCoords.length - 1; i > 0; i--) {
    const rawVal = Math.sin(seed * 733 + i * 37) * 10000;
    const rnd = rawVal - Math.floor(rawVal);
    const j = Math.floor(rnd * (i + 1));
    const temp = candidateCoords[i];
    candidateCoords[i] = candidateCoords[j];
    candidateCoords[j] = temp;
  }

  const actualCount = Math.min(count, candidateCoords.length);
  for (let i = 0; i < actualCount; i++) {
    const [r, c] = candidateCoords[i];
    const targetType = types[i % types.length];
    result.push({ row: r, column: c, type: targetType });
  }

  return result;
}

function build50Levels(): LevelData[] {
  const list: LevelData[] = [];

  // ==========================================
  // WORLD 1: EMERALD FOREST (Levels 1 to 10)
  // ==========================================

  // Level 1: 1 Diamond (Gentle tutorial)
  list.push({
    id: 1,
    worldId: 1,
    title: 'First Diamond',
    boardSize: 6,
    initialBoard: {},
    targetType: 'diamond',
    targets: [target(2, 2, 'diamond')],
    targetCount: 1,
    objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: 1, currentAmount: 0 },
    starThresholds: [300, 600, 900],
    rewardCoins: 10,
    rewardGems: 1,
    difficulty: 'Easy'
  });

  // Level 2: 2 Diamonds
  list.push({
    id: 2,
    worldId: 1,
    title: 'Twin Jewels',
    boardSize: 6,
    initialBoard: {},
    targetType: 'diamond',
    targets: [target(2, 2, 'diamond'), target(3, 3, 'diamond')],
    targetCount: 2,
    objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: 2, currentAmount: 0 },
    starThresholds: [400, 750, 1100],
    rewardCoins: 10,
    rewardGems: 1,
    difficulty: 'Easy'
  });

  // Level 3: 3 Yellow Gems
  list.push({
    id: 3,
    worldId: 1,
    title: 'Golden Trio',
    boardSize: 7,
    initialBoard: {},
    targetType: 'yellow_gem',
    targets: [target(2, 3, 'yellow_gem'), target(4, 2, 'yellow_gem'), target(4, 4, 'yellow_gem')],
    targetCount: 3,
    objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: 3, currentAmount: 0 },
    starThresholds: [500, 900, 1300],
    rewardCoins: 12,
    rewardGems: 1,
    difficulty: 'Easy'
  });

  // Level 4: 4 Red Stars
  list.push({
    id: 4,
    worldId: 1,
    title: 'Four Stars',
    boardSize: 7,
    initialBoard: {
      '0,0': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '0,6': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '6,0': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '6,6': obstacle(BlockColorType.NONE, SpecialBlockType.STONE)
    },
    targetType: 'red_star',
    targets: [
      target(2, 2, 'red_star'),
      target(2, 4, 'red_star'),
      target(4, 2, 'red_star'),
      target(4, 4, 'red_star')
    ],
    targetCount: 4,
    objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: 4, currentAmount: 0 },
    starThresholds: [550, 950, 1400],
    rewardCoins: 12,
    rewardGems: 1,
    difficulty: 'Medium'
  });

  // Level 5: 5 Blue Diamonds
  list.push({
    id: 5,
    worldId: 1,
    title: 'Gem Cavern',
    boardSize: 8,
    initialBoard: {},
    targetType: 'diamond',
    targets: [
      target(2, 2, 'diamond'),
      target(2, 5, 'diamond'),
      target(5, 2, 'diamond'),
      target(5, 5, 'diamond'),
      target(3, 3, 'diamond')
    ],
    targetCount: 5,
    objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: 5, currentAmount: 0 },
    starThresholds: [700, 1200, 1800],
    rewardCoins: 15,
    rewardGems: 2,
    difficulty: 'Medium'
  });

  // Level 6: 6 Golden Stars
  list.push({
    id: 6,
    worldId: 1,
    title: 'Starry Cross',
    boardSize: 8,
    initialBoard: {},
    targetType: 'star',
    targets: [
      target(2, 3, 'star'),
      target(3, 2, 'star'),
      target(3, 4, 'star'),
      target(4, 3, 'star'),
      target(1, 3, 'star'),
      target(5, 3, 'star')
    ],
    targetCount: 6,
    objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: 6, currentAmount: 0 },
    starThresholds: [750, 1250, 1800],
    rewardCoins: 15,
    rewardGems: 2,
    difficulty: 'Medium'
  });

  // Level 7: 7 Green Gems
  list.push({
    id: 7,
    worldId: 1,
    title: 'Emerald Ring',
    boardSize: 8,
    initialBoard: {},
    targetType: 'green_gem',
    targets: [
      target(2, 2, 'green_gem'),
      target(2, 5, 'green_gem'),
      target(5, 2, 'green_gem'),
      target(5, 5, 'green_gem'),
      target(3, 2, 'green_gem'),
      target(3, 5, 'green_gem'),
      target(4, 3, 'green_gem')
    ],
    targetCount: 7,
    objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: 7, currentAmount: 0 },
    starThresholds: [800, 1300, 1900],
    rewardCoins: 16,
    rewardGems: 2,
    difficulty: 'Medium'
  });

  // Level 8: 6 Pig Obstacles (Pig obstacle asset introduction)
  list.push({
    id: 8,
    worldId: 1,
    title: 'Piggy Meadow',
    boardSize: 8,
    initialBoard: {},
    targetType: 'pig',
    targets: [
      target(2, 2, 'pig'),
      target(2, 5, 'pig'),
      target(5, 2, 'pig'),
      target(5, 5, 'pig'),
      target(3, 3, 'pig'),
      target(4, 4, 'pig')
    ],
    targetCount: 6,
    objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: 6, currentAmount: 0 },
    starThresholds: [850, 1400, 2000],
    rewardCoins: 18,
    rewardGems: 2,
    difficulty: 'Medium'
  });

  // Level 9: 7 Stick Obstacles (Stick obstacle asset introduction)
  list.push({
    id: 9,
    worldId: 1,
    title: 'Twig Forest',
    boardSize: 8,
    initialBoard: {},
    targetType: 'stick',
    targets: [
      target(1, 3, 'stick'),
      target(2, 4, 'stick'),
      target(3, 2, 'stick'),
      target(4, 5, 'stick'),
      target(5, 3, 'stick'),
      target(6, 4, 'stick'),
      target(3, 4, 'stick')
    ],
    targetCount: 7,
    objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: 7, currentAmount: 0 },
    starThresholds: [900, 1500, 2100],
    rewardCoins: 18,
    rewardGems: 2,
    difficulty: 'Hard'
  });

  // Level 10: 8 Royal Crowns (Boss Level)
  list.push({
    id: 10,
    worldId: 1,
    title: 'Royal Crown',
    boardSize: 8,
    initialBoard: {
      '0,0': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '0,7': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '7,0': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '7,7': obstacle(BlockColorType.NONE, SpecialBlockType.STONE)
    },
    targetType: 'crown',
    targets: [
      target(2, 1, 'crown'),
      target(2, 3, 'crown'),
      target(2, 5, 'crown'),
      target(4, 2, 'crown'),
      target(4, 4, 'crown'),
      target(5, 2, 'crown'),
      target(5, 4, 'crown'),
      target(3, 3, 'crown')
    ],
    targetCount: 8,
    objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: 8, currentAmount: 0 },
    starThresholds: [1000, 1600, 2300],
    rewardCoins: 25,
    rewardGems: 3,
    difficulty: 'Boss'
  });

  // ==========================================
  // WORLD 2: SOLAR DESERT (Levels 11 to 20)
  // Multi-target levels (Red Star + Yellow Gem, matching reference screenshot!)
  // ==========================================
  const desertTitles = [
    'Dune Gate', 'Mirage Valley', 'Sun Temple', 'Oasis Well', 'Pyramid Core',
    'Sandstorm', 'Golden Scarab', 'Sunken Crypt', "Pharaoh's Vault", 'Desert Titan'
  ];

  for (let i = 11; i <= 20; i++) {
    const offset = i - 11;
    const count = 6 + offset;
    const initialBoard: Record<string, CellState> = {};
    if (i >= 14) {
      initialBoard['0,0'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
      initialBoard['0,7'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
    }

    // Mix of Red Star and Yellow Gem (as shown in reference screenshot)
    const types = i % 2 === 0 ? ['red_star', 'yellow_gem'] : ['pig', 'stick'];
    const generated = generatePatternTargets(8, count, types, initialBoard, i * 19);

    list.push({
      id: i,
      worldId: 2,
      title: desertTitles[offset],
      boardSize: 8,
      initialBoard,
      targetType: types[0],
      targets: generated,
      targetCount: generated.length,
      objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: generated.length, currentAmount: 0 },
      starThresholds: [1000 + offset * 120, 1600 + offset * 150, 2300 + offset * 180],
      rewardCoins: 40 + offset * 8,
      rewardGems: i === 20 ? 5 : 2,
      difficulty: i === 20 ? 'Boss' : i >= 17 ? 'Hard' : 'Medium'
    });
  }

  // ==========================================
  // WORLD 3: ARCTIC GLACIER (Levels 21 to 30)
  // Diamonds, Purple Gems, and Ice Blocks
  // ==========================================
  const arcticTitles = [
    'Frost Peak', 'Icefall Cave', 'Glacier Chasm', 'Crystal Spire', 'Blizzard Pass',
    'Frozen Lake', 'Aurora Valley', 'Biting Wind', 'Winter Citadel', 'The Frostbite'
  ];

  for (let i = 21; i <= 30; i++) {
    const offset = i - 21;
    const count = 7 + offset;
    const initialBoard: Record<string, CellState> = {
      '1,1': obstacle(BlockColorType.NONE, SpecialBlockType.ICE),
      '6,6': obstacle(BlockColorType.NONE, SpecialBlockType.ICE)
    };
    if (i >= 25) {
      initialBoard['1,6'] = obstacle(BlockColorType.NONE, SpecialBlockType.ICE);
      initialBoard['6,1'] = obstacle(BlockColorType.NONE, SpecialBlockType.ICE);
    }

    const types = ['blue_diamond', 'purple_gem'];
    const generated = generatePatternTargets(8, count, types, initialBoard, i * 23);

    list.push({
      id: i,
      worldId: 3,
      title: arcticTitles[offset],
      boardSize: 8,
      initialBoard,
      targetType: 'blue_diamond',
      targets: generated,
      targetCount: generated.length,
      objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: generated.length, currentAmount: 0 },
      starThresholds: [1200 + offset * 140, 1800 + offset * 170, 2600 + offset * 200],
      rewardCoins: 100 + offset * 10,
      rewardGems: i === 30 ? 6 : 3,
      difficulty: i === 30 ? 'Boss' : i >= 27 ? 'Hard' : 'Medium'
    });
  }

  // ==========================================
  // WORLD 4: VOLCANIC CALDERA (Levels 31 to 40)
  // Red Stars, Coins, and Crowns
  // ==========================================
  const volcanicTitles = [
    'Magma Ridge', 'Ash Plateau', 'Obsidian Gate', 'Cinder Core', 'Lava Trench',
    'Ember Bastion', 'Brimstone Vault', 'Firefall Cavern', 'Infernal Heart', 'Magma Sovereign'
  ];

  for (let i = 31; i <= 40; i++) {
    const offset = i - 31;
    const count = 8 + offset;
    const initialBoard: Record<string, CellState> = {};
    if (i >= 33) {
      initialBoard['0,3'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
      initialBoard['0,4'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
      initialBoard['7,3'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
      initialBoard['7,4'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
    }

    const types = ['red_star', 'coin'];
    const generated = generatePatternTargets(8, count, types, initialBoard, i * 29);

    list.push({
      id: i,
      worldId: 4,
      title: volcanicTitles[offset],
      boardSize: 8,
      initialBoard,
      targetType: 'red_star',
      targets: generated,
      targetCount: generated.length,
      objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: generated.length, currentAmount: 0 },
      starThresholds: [1500 + offset * 160, 2200 + offset * 190, 3100 + offset * 220],
      rewardCoins: 180 + offset * 15,
      rewardGems: i === 40 ? 8 : 4,
      difficulty: i === 40 ? 'Boss' : i >= 37 ? 'Expert' : 'Hard'
    });
  }

  // ==========================================
  // WORLD 5: CYBER NEBULA (Levels 41 to 50)
  // Rainbow Gems, Hearts, and Crowns
  // ==========================================
  const cyberTitles = [
    'Neon Horizon', 'Quantum Grid', 'Cyber Core', 'Data Stream', 'Matrix Breach',
    'Synapse Loop', 'Orbital Gateway', 'Starlight Zenith', 'Apex Singularity', 'The Grandmaster'
  ];

  for (let i = 41; i <= 50; i++) {
    const offset = i - 41;
    const count = 9 + offset;
    const initialBoard: Record<string, CellState> = {
      '0,0': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '0,7': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '7,0': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '7,7': obstacle(BlockColorType.NONE, SpecialBlockType.STONE)
    };

    const types = ['rainbow_gem', 'heart', 'crown'];
    const generated = generatePatternTargets(8, count, types, initialBoard, i * 31);

    list.push({
      id: i,
      worldId: 5,
      title: cyberTitles[offset],
      boardSize: 8,
      initialBoard,
      targetType: 'rainbow_gem',
      targets: generated,
      targetCount: generated.length,
      objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: generated.length, currentAmount: 0 },
      starThresholds: [1800 + offset * 180, 2600 + offset * 220, 3600 + offset * 250],
      rewardCoins: 300 + offset * 25,
      rewardGems: i === 50 ? 10 : 5,
      difficulty: i === 50 ? 'Grandmaster' : 'Expert'
    });
  }

  return list;
}

export const ALL_LEVELS: LevelData[] = build50Levels();

export function getLevel(id: number): LevelData {
  const clamped = Math.max(1, Math.min(50, id));
  return ALL_LEVELS[clamped - 1] || ALL_LEVELS[0];
}
