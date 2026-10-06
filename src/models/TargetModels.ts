export type TargetType =
  | 'diamond'
  | 'blue_diamond'
  | 'red_star'
  | 'yellow_gem'
  | 'green_gem'
  | 'purple_gem'
  | 'star'
  | 'crown'
  | 'coin'
  | 'rainbow_gem'
  | 'heart'
  | 'pig'
  | 'stick';

export interface TargetConfig {
  row: number;
  column: number;
  type: TargetType | string;
  visualAsset?: string;
}

export interface BoardTarget {
  targetId: string;
  row: number;
  column: number;
  type: TargetType | string;
  collected: boolean;
  visualAsset?: string;
}

export interface TargetTypeMeta {
  displayName: string;
  color: string;
}

export const TARGET_TYPE_METAS: Record<string, TargetTypeMeta> = {
  diamond: { displayName: 'Blue Diamond', color: '#00B4D8' },
  blue_diamond: { displayName: 'Blue Diamond', color: '#00B4D8' },
  red_star: { displayName: 'Red Star', color: '#E63946' },
  yellow_gem: { displayName: 'Yellow Gem', color: '#F77F00' },
  green_gem: { displayName: 'Green Gem', color: '#2A9D8F' },
  purple_gem: { displayName: 'Purple Gem', color: '#7209B7' },
  star: { displayName: 'Star', color: '#FFB703' },
  crown: { displayName: 'Crown', color: '#FB8500' },
  coin: { displayName: 'Coin', color: '#FFD166' },
  rainbow_gem: { displayName: 'Rainbow Gem', color: '#F72585' },
  heart: { displayName: 'Heart Gem', color: '#FF4D6D' },
  pig: { displayName: 'Pig Obstacle', color: '#FF70A6' },
  stick: { displayName: 'Stick Obstacle', color: '#A0522D' }
};
