import { BlockColorType, PLAYABLE_COLORS, getRandomPlayableColor } from '../models/BlockColor.ts';
import { Piece, createPiece } from '../models/Piece.ts';
import { PieceShapeType, createPieceShape } from '../models/PieceShape.ts';
import { SpecialBlockType } from '../models/SpecialBlockType.ts';

export class PieceEngine {
  private commonShapes: PieceShapeType[] = [
    PieceShapeType.DOT_1,
    PieceShapeType.LINE_2_H,
    PieceShapeType.LINE_2_V,
    PieceShapeType.LINE_3_H,
    PieceShapeType.LINE_3_V,
    PieceShapeType.SQUARE_2X2,
    PieceShapeType.CORNER_2X2_TL,
    PieceShapeType.CORNER_2X2_TR,
    PieceShapeType.CORNER_2X2_BL,
    PieceShapeType.CORNER_2X2_BR,
    PieceShapeType.L_3X2_0,
    PieceShapeType.L_3X2_90,
    PieceShapeType.J_3X2_0,
    PieceShapeType.T_3X2_UP,
    PieceShapeType.T_3X2_DOWN,
    PieceShapeType.S_H,
    PieceShapeType.Z_H
  ];

  private complexShapes: PieceShapeType[] = [
    PieceShapeType.LINE_4_H,
    PieceShapeType.LINE_4_V,
    PieceShapeType.LINE_5_H,
    PieceShapeType.LINE_5_V,
    PieceShapeType.SQUARE_3X3,
    PieceShapeType.CROSS_3X3,
    PieceShapeType.L_3X2_180,
    PieceShapeType.L_3X2_270,
    PieceShapeType.J_3X2_180,
    PieceShapeType.J_3X2_270,
    PieceShapeType.T_3X2_LEFT,
    PieceShapeType.T_3X2_RIGHT,
    PieceShapeType.S_V,
    PieceShapeType.Z_V
  ];

  private getRandomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  generatePieceTrio(includeSpecials: boolean = true): Piece[] {
    const result: Piece[] = [];
    const shapePool: PieceShapeType[] = [];

    // Guarantee at least one smaller, highly playable shape to reduce early game overs
    shapePool.push(this.getRandomFrom(this.commonShapes));

    // 2nd piece: common or complex
    if (Math.random() < 0.35) {
      shapePool.push(this.getRandomFrom(this.complexShapes));
    } else {
      shapePool.push(this.getRandomFrom(this.commonShapes));
    }

    // 3rd piece: random
    if (Math.random() < 0.25) {
      shapePool.push(this.getRandomFrom(this.complexShapes));
    } else {
      shapePool.push(this.getRandomFrom(this.commonShapes));
    }

    // Assign distinct colors where possible
    const availableColors = [...PLAYABLE_COLORS].sort(() => Math.random() - 0.5);

    for (const shapeType of shapePool) {
      const color = availableColors.pop() || getRandomPlayableColor();
      let specialType = SpecialBlockType.NONE;

      if (includeSpecials && Math.random() < 0.12) {
        const randSpecial = Math.floor(Math.random() * 4);
        if (randSpecial === 0) specialType = SpecialBlockType.BOMB;
        else if (randSpecial === 1) specialType = SpecialBlockType.ROCKET_ROW;
        else if (randSpecial === 2) specialType = SpecialBlockType.ROCKET_COL;
        else specialType = SpecialBlockType.RAINBOW;
      }

      result.push(createPiece(createPieceShape(shapeType), color, specialType));
    }

    return result;
  }
}
