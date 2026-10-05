export interface BlockColorDef {
  id: string;
  name: string;
  primaryColor: string;
  lightBevelColor: string;
  darkBevelColor: string;
  specularColor: string;
  glowColor: string;
}

export enum BlockColorType {
  RED = 'RED',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  ORANGE = 'ORANGE',
  PURPLE = 'PURPLE',
  CYAN = 'CYAN',
  PINK = 'PINK',
  RAINBOW = 'RAINBOW',
  NONE = 'NONE'
}

export const BLOCK_COLORS: Record<BlockColorType, BlockColorDef> = {
  [BlockColorType.RED]: {
    id: 'red',
    name: 'Red',
    primaryColor: '#FF2D55',
    lightBevelColor: '#FF7A95',
    darkBevelColor: '#C7002B',
    specularColor: '#FFFFFF',
    glowColor: 'rgba(255, 45, 85, 0.5)'
  },
  [BlockColorType.YELLOW]: {
    id: 'yellow',
    name: 'Yellow',
    primaryColor: '#FFCC00',
    lightBevelColor: '#FFE680',
    darkBevelColor: '#D69E00',
    specularColor: '#FFFFFF',
    glowColor: 'rgba(255, 204, 0, 0.5)'
  },
  [BlockColorType.GREEN]: {
    id: 'green',
    name: 'Green',
    primaryColor: '#34C759',
    lightBevelColor: '#86E49D',
    darkBevelColor: '#1E8738',
    specularColor: '#FFFFFF',
    glowColor: 'rgba(52, 199, 89, 0.5)'
  },
  [BlockColorType.BLUE]: {
    id: 'blue',
    name: 'Blue',
    primaryColor: '#007AFF',
    lightBevelColor: '#68B1FF',
    darkBevelColor: '#0051B3',
    specularColor: '#FFFFFF',
    glowColor: 'rgba(0, 122, 255, 0.5)'
  },
  [BlockColorType.ORANGE]: {
    id: 'orange',
    name: 'Orange',
    primaryColor: '#FF9500',
    lightBevelColor: '#FFC066',
    darkBevelColor: '#C66900',
    specularColor: '#FFFFFF',
    glowColor: 'rgba(255, 149, 0, 0.5)'
  },
  [BlockColorType.PURPLE]: {
    id: 'purple',
    name: 'Purple',
    primaryColor: '#AF52DE',
    lightBevelColor: '#D396F1',
    darkBevelColor: '#7A21AA',
    specularColor: '#FFFFFF',
    glowColor: 'rgba(175, 82, 222, 0.5)'
  },
  [BlockColorType.CYAN]: {
    id: 'cyan',
    name: 'Cyan',
    primaryColor: '#00C7BE',
    lightBevelColor: '#75E6E0',
    darkBevelColor: '#008A84',
    specularColor: '#FFFFFF',
    glowColor: 'rgba(0, 199, 190, 0.5)'
  },
  [BlockColorType.PINK]: {
    id: 'pink',
    name: 'Pink',
    primaryColor: '#FF2D8D',
    lightBevelColor: '#FF85BF',
    darkBevelColor: '#B8005A',
    specularColor: '#FFFFFF',
    glowColor: 'rgba(255, 45, 141, 0.5)'
  },
  [BlockColorType.RAINBOW]: {
    id: 'rainbow',
    name: 'Rainbow',
    primaryColor: '#FF3B30',
    lightBevelColor: '#FFCC00',
    darkBevelColor: '#5856D6',
    specularColor: '#FFFFFF',
    glowColor: 'rgba(255, 204, 0, 0.5)'
  },
  [BlockColorType.NONE]: {
    id: 'none',
    name: 'None',
    primaryColor: 'transparent',
    lightBevelColor: 'transparent',
    darkBevelColor: 'transparent',
    specularColor: 'transparent',
    glowColor: 'transparent'
  }
};

export const PLAYABLE_COLORS: BlockColorType[] = [
  BlockColorType.RED,
  BlockColorType.YELLOW,
  BlockColorType.GREEN,
  BlockColorType.BLUE,
  BlockColorType.ORANGE,
  BlockColorType.PURPLE,
  BlockColorType.CYAN,
  BlockColorType.PINK
];

export function getRandomPlayableColor(): BlockColorType {
  const index = Math.floor(Math.random() * PLAYABLE_COLORS.length);
  return PLAYABLE_COLORS[index];
}
