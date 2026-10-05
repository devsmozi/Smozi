import { BlockColorType } from './BlockColor.ts';
import { PieceShape } from './PieceShape.ts';
import { SpecialBlockType } from './SpecialBlockType.ts';

export interface Piece {
  id: string;
  shape: PieceShape;
  color: BlockColorType;
  specialType: SpecialBlockType;
  assetRef: string;
  blockCount: number;
}

export function createPiece(
  shape: PieceShape,
  color: BlockColorType,
  specialType: SpecialBlockType = SpecialBlockType.NONE,
  id: string = Math.random().toString(36).substring(2, 9)
): Piece {
  return {
    id,
    shape,
    color,
    specialType,
    assetRef: `piece_${shape.type.toLowerCase()}`,
    blockCount: shape.blockCount
  };
}
