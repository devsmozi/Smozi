import { BlockColorType } from '../models/BlockColor.ts';
import { CellState } from '../models/CellState.ts';
import { LevelData, ObjectiveType } from '../models/GameModels.ts';
import { SpecialBlockType } from '../models/SpecialBlockType.ts';

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

function build50Levels(): LevelData[] {
  const list: LevelData[] = [];

  // ==========================================
  // WORLD 1: EMERALD FOREST (Levels 1 to 10)
  // ==========================================
  list.push({
    id: 1,
    worldId: 1,
    title: 'First Steps',
    initialBoard: {},
    objective: { type: ObjectiveType.CLEAR_COLOR, targetAmount: 10, currentAmount: 0, targetColor: BlockColorType.RED },
    moveLimit: 25,
    starThresholds: [400, 800, 1200],
    rewardCoins: 100,
    rewardGems: 2,
    difficulty: 'Easy'
  });

  list.push({
    id: 2,
    worldId: 1,
    title: 'Clear the Line',
    initialBoard: {},
    objective: { type: ObjectiveType.SCORE, targetAmount: 700, currentAmount: 0 },
    moveLimit: 22,
    starThresholds: [500, 900, 1300],
    rewardCoins: 100,
    rewardGems: 2,
    difficulty: 'Easy'
  });

  list.push({
    id: 3,
    worldId: 1,
    title: 'Azure Stream',
    initialBoard: {},
    objective: { type: ObjectiveType.CLEAR_COLOR, targetAmount: 14, currentAmount: 0, targetColor: BlockColorType.BLUE },
    moveLimit: 24,
    starThresholds: [600, 1000, 1500],
    rewardCoins: 120,
    rewardGems: 2,
    difficulty: 'Easy'
  });

  list.push({
    id: 4,
    worldId: 1,
    title: 'Corner Stones',
    initialBoard: {
      '0,0': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '0,7': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '7,0': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '7,7': obstacle(BlockColorType.NONE, SpecialBlockType.STONE)
    },
    objective: { type: ObjectiveType.CLEAR_COLOR, targetAmount: 12, currentAmount: 0, targetColor: BlockColorType.YELLOW },
    moveLimit: 22,
    starThresholds: [650, 1100, 1600],
    rewardCoins: 120,
    rewardGems: 2,
    difficulty: 'Medium'
  });

  list.push({
    id: 5,
    worldId: 1,
    title: 'Gem Cavern',
    initialBoard: {
      '3,3': obstacle(BlockColorType.BLUE, SpecialBlockType.GEM_BLUE),
      '3,4': obstacle(BlockColorType.BLUE, SpecialBlockType.GEM_BLUE),
      '4,3': obstacle(BlockColorType.BLUE, SpecialBlockType.GEM_BLUE),
      '4,4': obstacle(BlockColorType.BLUE, SpecialBlockType.GEM_BLUE)
    },
    objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: 4, currentAmount: 0 },
    moveLimit: 20,
    starThresholds: [700, 1200, 1800],
    rewardCoins: 150,
    rewardGems: 3,
    difficulty: 'Medium'
  });

  list.push({
    id: 6,
    worldId: 1,
    title: 'Emerald Grove',
    initialBoard: {},
    objective: { type: ObjectiveType.CLEAR_COLOR, targetAmount: 16, currentAmount: 0, targetColor: BlockColorType.GREEN },
    moveLimit: 22,
    starThresholds: [800, 1300, 1900],
    rewardCoins: 150,
    rewardGems: 3,
    difficulty: 'Medium'
  });

  list.push({
    id: 7,
    worldId: 1,
    title: 'Timber Barricade',
    initialBoard: {
      '2,2': obstacle(BlockColorType.NONE, SpecialBlockType.WOOD),
      '2,5': obstacle(BlockColorType.NONE, SpecialBlockType.WOOD),
      '5,2': obstacle(BlockColorType.NONE, SpecialBlockType.WOOD),
      '5,5': obstacle(BlockColorType.NONE, SpecialBlockType.WOOD)
    },
    objective: { type: ObjectiveType.CLEAR_SPECIAL, targetAmount: 4, currentAmount: 0, targetSpecial: SpecialBlockType.WOOD },
    moveLimit: 20,
    starThresholds: [850, 1400, 2000],
    rewardCoins: 160,
    rewardGems: 3,
    difficulty: 'Medium'
  });

  list.push({
    id: 8,
    worldId: 1,
    title: 'Ruby Cache',
    initialBoard: {
      '1,3': obstacle(BlockColorType.RED, SpecialBlockType.GEM_RED),
      '1,4': obstacle(BlockColorType.RED, SpecialBlockType.GEM_RED),
      '6,3': obstacle(BlockColorType.RED, SpecialBlockType.GEM_RED),
      '6,4': obstacle(BlockColorType.RED, SpecialBlockType.GEM_RED)
    },
    objective: { type: ObjectiveType.COLLECT_GEMS, targetAmount: 4, currentAmount: 0 },
    moveLimit: 22,
    starThresholds: [900, 1500, 2100],
    rewardCoins: 180,
    rewardGems: 3,
    difficulty: 'Medium'
  });

  list.push({
    id: 9,
    worldId: 1,
    title: 'Sunset Canopy',
    initialBoard: {},
    objective: { type: ObjectiveType.CLEAR_COLOR, targetAmount: 18, currentAmount: 0, targetColor: BlockColorType.ORANGE },
    moveLimit: 22,
    starThresholds: [1000, 1600, 2200],
    rewardCoins: 180,
    rewardGems: 3,
    difficulty: 'Hard'
  });

  list.push({
    id: 10,
    worldId: 1,
    title: 'Forest Warden',
    initialBoard: {
      '2,3': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '2,4': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '5,3': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '5,4': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '3,2': obstacle(BlockColorType.GREEN, SpecialBlockType.GEM_GREEN),
      '4,5': obstacle(BlockColorType.GREEN, SpecialBlockType.GEM_GREEN)
    },
    objective: { type: ObjectiveType.SCORE, targetAmount: 1500, currentAmount: 0 },
    moveLimit: 22,
    starThresholds: [1200, 1800, 2500],
    rewardCoins: 250,
    rewardGems: 5,
    difficulty: 'Boss'
  });

  // ==========================================
  // WORLD 2: SOLAR DESERT (Levels 11 to 20)
  // ==========================================
  const desertTitles = [
    'Dune Gate', 'Mirage Valley', 'Sun Temple', 'Oasis Well', 'Pyramid Core',
    'Sandstorm', 'Golden Scarab', 'Sunken Crypt', "Pharaoh's Vault", 'Desert Titan'
  ];
  for (let i = 11; i <= 20; i++) {
    const offset = i - 11;
    const objType = offset % 3 === 0 ? ObjectiveType.CLEAR_COLOR : offset % 3 === 1 ? ObjectiveType.SCORE : ObjectiveType.COLLECT_GEMS;
    const targetColors = [BlockColorType.YELLOW, BlockColorType.ORANGE, BlockColorType.PURPLE, BlockColorType.RED];
    const targetColor = targetColors[offset % 4];

    const desertObstacles: Record<string, CellState> = {};
    if (i >= 13) {
      desertObstacles['1,1'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
      desertObstacles['1,6'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
    }
    if (i >= 15) {
      desertObstacles['3,3'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
      desertObstacles['3,4'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
      desertObstacles['4,3'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
      desertObstacles['4,4'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
    }
    if (objType === ObjectiveType.COLLECT_GEMS) {
      desertObstacles['2,2'] = obstacle(BlockColorType.RED, SpecialBlockType.GEM_RED);
      desertObstacles['5,5'] = obstacle(BlockColorType.RED, SpecialBlockType.GEM_RED);
      desertObstacles['2,5'] = obstacle(BlockColorType.RED, SpecialBlockType.GEM_RED);
      desertObstacles['5,2'] = obstacle(BlockColorType.RED, SpecialBlockType.GEM_RED);
    }

    list.push({
      id: i,
      worldId: 2,
      title: desertTitles[offset],
      initialBoard: desertObstacles,
      objective: {
        type: objType,
        targetAmount:
          objType === ObjectiveType.CLEAR_COLOR
            ? 14 + offset
            : objType === ObjectiveType.SCORE
            ? 1000 + offset * 120
            : 4 + Math.floor(offset / 3),
        currentAmount: 0,
        targetColor: objType === ObjectiveType.CLEAR_COLOR ? targetColor : undefined
      },
      moveLimit: Math.max(16, 22 - Math.floor(offset / 3)),
      starThresholds: [900 + offset * 100, 1500 + offset * 120, 2200 + offset * 150],
      rewardCoins: 180 + offset * 15,
      rewardGems: i === 20 ? 6 : 3,
      difficulty: i === 20 ? 'Boss' : i >= 17 ? 'Hard' : 'Medium'
    });
  }

  // ==========================================
  // WORLD 3: ARCTIC GLACIER (Levels 21 to 30)
  // ==========================================
  const arcticTitles = [
    'Frozen Threshold', 'Icebound River', 'Glacial Ridge', 'Crystal Cavern', 'Permafrost Deep',
    'Frostbite Pass', 'Blizzard Eye', 'Aurora Peak', 'Shattered Ice', 'Glacier Colossus'
  ];
  for (let i = 21; i <= 30; i++) {
    const offset = i - 21;
    const iceObstacles: Record<string, CellState> = {
      '2,3': obstacle(BlockColorType.NONE, SpecialBlockType.ICE),
      '2,4': obstacle(BlockColorType.NONE, SpecialBlockType.ICE),
      '5,3': obstacle(BlockColorType.NONE, SpecialBlockType.ICE),
      '5,4': obstacle(BlockColorType.NONE, SpecialBlockType.ICE)
    };
    if (i >= 25) {
      iceObstacles['3,2'] = obstacle(BlockColorType.NONE, SpecialBlockType.ICE);
      iceObstacles['4,2'] = obstacle(BlockColorType.NONE, SpecialBlockType.ICE);
      iceObstacles['3,5'] = obstacle(BlockColorType.NONE, SpecialBlockType.ICE);
      iceObstacles['4,5'] = obstacle(BlockColorType.NONE, SpecialBlockType.ICE);
    }
    if (i % 2 === 1) {
      iceObstacles['1,1'] = obstacle(BlockColorType.BLUE, SpecialBlockType.GEM_BLUE);
      iceObstacles['6,6'] = obstacle(BlockColorType.BLUE, SpecialBlockType.GEM_BLUE);
    }

    const objType = offset % 3 === 0 ? ObjectiveType.CLEAR_SPECIAL : offset % 3 === 1 ? ObjectiveType.CLEAR_COLOR : ObjectiveType.SCORE;
    list.push({
      id: i,
      worldId: 3,
      title: arcticTitles[offset],
      initialBoard: iceObstacles,
      objective: {
        type: objType,
        targetAmount:
          objType === ObjectiveType.CLEAR_SPECIAL
            ? 4 + Math.floor(offset / 2)
            : objType === ObjectiveType.CLEAR_COLOR
            ? 16 + offset
            : 1400 + offset * 150,
        currentAmount: 0,
        targetColor: objType === ObjectiveType.CLEAR_COLOR ? BlockColorType.BLUE : undefined,
        targetSpecial: objType === ObjectiveType.CLEAR_SPECIAL ? SpecialBlockType.ICE : undefined
      },
      moveLimit: Math.max(17, 24 - Math.floor(offset / 2)),
      starThresholds: [1200 + offset * 120, 1800 + offset * 150, 2600 + offset * 180],
      rewardCoins: 220 + offset * 15,
      rewardGems: i === 30 ? 7 : 4,
      difficulty: i === 30 ? 'Boss' : i >= 27 ? 'Hard' : 'Medium'
    });
  }

  // ==========================================
  // WORLD 4: VOLCANIC CALDERA (Levels 31 to 40)
  // ==========================================
  const volcanicTitles = [
    'Obsidian Gate', 'Lava Tubes', 'Cinder Crater', 'Magma Chamber', 'Blast Forge',
    'Sulfur Springs', 'Pyre Ridge', 'Ignition Core', 'Eruption Trench', 'Inferno Dragon'
  ];
  for (let i = 31; i <= 40; i++) {
    const offset = i - 31;
    const magmaObstacles: Record<string, CellState> = {
      '3,3': obstacle(BlockColorType.NONE, SpecialBlockType.BOMB),
      '4,4': obstacle(BlockColorType.NONE, SpecialBlockType.BOMB)
    };
    if (i >= 34) {
      magmaObstacles['2,2'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
      magmaObstacles['5,5'] = obstacle(BlockColorType.NONE, SpecialBlockType.STONE);
      magmaObstacles['2,5'] = obstacle(BlockColorType.NONE, SpecialBlockType.ROCKET_ROW);
      magmaObstacles['5,2'] = obstacle(BlockColorType.NONE, SpecialBlockType.ROCKET_COL);
    }

    const objType = offset % 3 === 0 ? ObjectiveType.CLEAR_SPECIAL : offset % 3 === 1 ? ObjectiveType.CLEAR_COLOR : ObjectiveType.SCORE;
    list.push({
      id: i,
      worldId: 4,
      title: volcanicTitles[offset],
      initialBoard: magmaObstacles,
      objective: {
        type: objType,
        targetAmount:
          objType === ObjectiveType.CLEAR_SPECIAL
            ? 2 + Math.floor(offset / 3)
            : objType === ObjectiveType.CLEAR_COLOR
            ? 18 + offset
            : 1800 + offset * 200,
        currentAmount: 0,
        targetColor: objType === ObjectiveType.CLEAR_COLOR ? BlockColorType.RED : undefined,
        targetSpecial: objType === ObjectiveType.CLEAR_SPECIAL ? SpecialBlockType.BOMB : undefined
      },
      moveLimit: Math.max(16, 22 - Math.floor(offset / 3)),
      starThresholds: [1500 + offset * 150, 2200 + offset * 180, 3100 + offset * 200],
      rewardCoins: 260 + offset * 20,
      rewardGems: i === 40 ? 8 : 4,
      difficulty: i === 40 ? 'Boss' : i >= 37 ? 'Expert' : 'Hard'
    });
  }

  // ==========================================
  // WORLD 5: CYBER NEBULA (Levels 41 to 50)
  // ==========================================
  const cyberTitles = [
    'Neon Horizon', 'Quantum Grid', 'Cyber Core', 'Data Stream', 'Matrix Breach',
    'Synapse Loop', 'Orbital Gateway', 'Starlight Zenith', 'Apex Singularity', 'The Grandmaster'
  ];
  for (let i = 41; i <= 50; i++) {
    const offset = i - 41;
    const cyberObstacles: Record<string, CellState> = {
      '0,0': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '0,7': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '7,0': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '7,7': obstacle(BlockColorType.NONE, SpecialBlockType.STONE),
      '3,3': obstacle(BlockColorType.NONE, SpecialBlockType.RAINBOW),
      '4,4': obstacle(BlockColorType.NONE, SpecialBlockType.RAINBOW)
    };
    if (i >= 45) {
      cyberObstacles['1,6'] = obstacle(BlockColorType.NONE, SpecialBlockType.ICE);
      cyberObstacles['6,1'] = obstacle(BlockColorType.NONE, SpecialBlockType.ICE);
      cyberObstacles['2,2'] = obstacle(BlockColorType.BLUE, SpecialBlockType.GEM_BLUE);
      cyberObstacles['5,5'] = obstacle(BlockColorType.RED, SpecialBlockType.GEM_RED);
    }

    const objType = offset % 3 === 0 ? ObjectiveType.CLEAR_SPECIAL : offset % 3 === 1 ? ObjectiveType.SCORE : ObjectiveType.COLLECT_GEMS;
    list.push({
      id: i,
      worldId: 5,
      title: cyberTitles[offset],
      initialBoard: cyberObstacles,
      objective: {
        type: objType,
        targetAmount:
          objType === ObjectiveType.CLEAR_SPECIAL
            ? 2 + Math.floor(offset / 3)
            : objType === ObjectiveType.SCORE
            ? 2200 + offset * 250
            : 6,
        currentAmount: 0,
        targetSpecial: objType === ObjectiveType.CLEAR_SPECIAL ? SpecialBlockType.RAINBOW : undefined
      },
      moveLimit: Math.max(16, 22 - Math.floor(offset / 4)),
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
