import { BlockColorType } from './BlockColor.ts';
import { SpecialBlockType } from './SpecialBlockType.ts';

export interface CellState {
  row: number;
  col: number;
  isOccupied: boolean;
  color: BlockColorType;
  specialType: SpecialBlockType;
  durability: number;
  isClearing?: boolean;
  isHighlighted?: boolean;
  isPossiblePlacement?: boolean;
}

export function createEmptyCell(row: number, col: number): CellState {
  return {
    row,
    col,
    isOccupied: false,
    color: BlockColorType.NONE,
    specialType: SpecialBlockType.NONE,
    durability: 1,
    isClearing: false
  };
}

export function isObstacleCell(cell: CellState): boolean {
  return [
    SpecialBlockType.ICE,
    SpecialBlockType.STONE,
    SpecialBlockType.WOOD,
    SpecialBlockType.LOCKED
  ].includes(cell.specialType);
}
