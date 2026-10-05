export enum SpecialBlockType {
  NONE = 'NONE',
  RAINBOW = 'RAINBOW',
  BOMB = 'BOMB',
  ROCKET_ROW = 'ROCKET_ROW',
  ROCKET_COL = 'ROCKET_COL',
  LIGHTNING = 'LIGHTNING',
  COLOR_BALL = 'COLOR_BALL',
  ICE = 'ICE',
  STONE = 'STONE',
  WOOD = 'WOOD',
  LOCKED = 'LOCKED',
  GEM_BLUE = 'GEM_BLUE',
  GEM_RED = 'GEM_RED',
  GEM_GREEN = 'GEM_GREEN'
}

export interface SpecialBlockMeta {
  displayName: string;
  description: string;
}

export const SPECIAL_BLOCK_INFO: Record<SpecialBlockType, SpecialBlockMeta> = {
  [SpecialBlockType.NONE]: { displayName: 'Normal', description: 'Standard puzzle block' },
  [SpecialBlockType.RAINBOW]: { displayName: 'Rainbow Block', description: 'Clears all blocks of the same color' },
  [SpecialBlockType.BOMB]: { displayName: 'Bomb', description: 'Clears surrounding 3x3 blocks with explosion' },
  [SpecialBlockType.ROCKET_ROW]: { displayName: 'Rocket (Row)', description: 'Clears an entire horizontal row' },
  [SpecialBlockType.ROCKET_COL]: { displayName: 'Rocket (Column)', description: 'Clears an entire vertical column' },
  [SpecialBlockType.LIGHTNING]: { displayName: 'Lightning', description: 'Clears multiple lines across the board' },
  [SpecialBlockType.COLOR_BALL]: { displayName: 'Color Ball', description: 'Clears any selected color' },
  [SpecialBlockType.ICE]: { displayName: 'Ice Block', description: 'Freezes block, must be cleared twice' },
  [SpecialBlockType.STONE]: { displayName: 'Stone Block', description: 'Heavy obstacle that requires multiple hits' },
  [SpecialBlockType.WOOD]: { displayName: 'Wooden Box', description: 'Wooden crate cleared by adjacent line clears' },
  [SpecialBlockType.LOCKED]: { displayName: 'Locked Block', description: 'Chained block unlocked by line clears' },
  [SpecialBlockType.GEM_BLUE]: { displayName: 'Blue Gem', description: 'Collectible blue sapphire' },
  [SpecialBlockType.GEM_RED]: { displayName: 'Red Gem', description: 'Collectible red ruby' },
  [SpecialBlockType.GEM_GREEN]: { displayName: 'Green Gem', description: 'Collectible emerald' }
};
