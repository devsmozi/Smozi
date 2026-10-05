import { BlockColorType, PLAYABLE_COLORS, getRandomPlayableColor } from '../models/BlockColor.ts';
import { Piece, createPiece } from '../models/Piece.ts';
import { PieceShapeType, createPieceShape } from '../models/PieceShape.ts';
import { SpecialBlockType } from '../models/SpecialBlockType.ts';

export class PieceEngine {
  // Simple shapes: 1-dots, 2-lines, 3-lines, 2x2 squares, corners
  private simpleShapes: PieceShapeType[] = [
    PieceShapeType.DOT_1,
    PieceShapeType.LINE_2_H,
    PieceShapeType.LINE_2_V,
    PieceShapeType.LINE_3_H,
    PieceShapeType.LINE_3_V,
    PieceShapeType.SQUARE_2X2,
    PieceShapeType.CORNER_2X2_TL,
    PieceShapeType.CORNER_2X2_TR,
    PieceShapeType.CORNER_2X2_BL,
    PieceShapeType.CORNER_2X2_BR
  ];

  // Medium shapes: L, J, T, S, Z, 4-lines
  private mediumShapes: PieceShapeType[] = [
    PieceShapeType.L_3X2_0,
    PieceShapeType.L_3X2_90,
    PieceShapeType.J_3X2_0,
    PieceShapeType.J_3X2_90,
    PieceShapeType.T_3X2_UP,
    PieceShapeType.T_3X2_DOWN,
    PieceShapeType.S_H,
    PieceShapeType.Z_H,
    PieceShapeType.LINE_4_H,
    PieceShapeType.LINE_4_V
  ];

  // Hard shapes: 5-lines, 3x3 squares, crosses, flipped L/J/T/S/Z
  private hardShapes: PieceShapeType[] = [
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

  /**
   * Generates a piece trio with progressive difficulty and fairness safeguard:
   * Difficulty 1: Mostly simple shapes (high fit rate).
   * Difficulty 2: Mix of simple and medium shapes.
   * Difficulty 3: Balanced simple, medium, and hard shapes.
   * Difficulty 4+: High ratio of medium and hard shapes.
   *
   * @param includeSpecials - whether special blocks like bomb/rockets can spawn
   * @param difficultyLevel - 1 to 5
   * @param fitnessChecker - optional callback to verify if at least one generated piece is playable
   */
  generatePieceTrio(
    includeSpecials: boolean = true,
    difficultyLevel: number = 1,
    fitnessChecker?: (piece: Piece) => boolean
  ): Piece[] {
    const result: Piece[] = [];
    const shapePool: PieceShapeType[] = [];

    // Always give at least 1 friendly piece so player doesn't get immediately stuck
    if (difficultyLevel <= 2) {
      shapePool.push(this.getRandomFrom(this.simpleShapes));
    } else {
      shapePool.push(Math.random() < 0.6 ? this.getRandomFrom(this.simpleShapes) : this.getRandomFrom(this.mediumShapes));
    }

    // 2nd piece based on difficulty
    if (difficultyLevel === 1) {
      shapePool.push(Math.random() < 0.8 ? this.getRandomFrom(this.simpleShapes) : this.getRandomFrom(this.mediumShapes));
    } else if (difficultyLevel === 2) {
      shapePool.push(Math.random() < 0.5 ? this.getRandomFrom(this.simpleShapes) : this.getRandomFrom(this.mediumShapes));
    } else if (difficultyLevel === 3) {
      const rand = Math.random();
      if (rand < 0.3) shapePool.push(this.getRandomFrom(this.simpleShapes));
      else if (rand < 0.8) shapePool.push(this.getRandomFrom(this.mediumShapes));
      else shapePool.push(this.getRandomFrom(this.hardShapes));
    } else {
      const rand = Math.random();
      if (rand < 0.2) shapePool.push(this.getRandomFrom(this.simpleShapes));
      else if (rand < 0.6) shapePool.push(this.getRandomFrom(this.mediumShapes));
      else shapePool.push(this.getRandomFrom(this.hardShapes));
    }

    // 3rd piece based on difficulty
    if (difficultyLevel === 1) {
      shapePool.push(Math.random() < 0.7 ? this.getRandomFrom(this.simpleShapes) : this.getRandomFrom(this.mediumShapes));
    } else if (difficultyLevel === 2) {
      shapePool.push(Math.random() < 0.3 ? this.getRandomFrom(this.hardShapes) : this.getRandomFrom(this.mediumShapes));
    } else {
      shapePool.push(Math.random() < 0.5 ? this.getRandomFrom(this.hardShapes) : this.getRandomFrom(this.mediumShapes));
    }

    // Assign distinct vibrant colors
    const availableColors = [...PLAYABLE_COLORS].sort(() => Math.random() - 0.5);

    for (const shapeType of shapePool) {
      const color = availableColors.pop() || getRandomPlayableColor();
      let specialType = SpecialBlockType.NONE;

      const specialChance = difficultyLevel >= 3 ? 0.16 : 0.10;
      if (includeSpecials && Math.random() < specialChance) {
        const randSpecial = Math.floor(Math.random() * 4);
        if (randSpecial === 0) specialType = SpecialBlockType.BOMB;
        else if (randSpecial === 1) specialType = SpecialBlockType.ROCKET_ROW;
        else if (randSpecial === 2) specialType = SpecialBlockType.ROCKET_COL;
        else specialType = SpecialBlockType.RAINBOW;
      }

      result.push(createPiece(createPieceShape(shapeType), color, specialType));
    }

    // Fairness Safeguard: If none of the 3 pieces can fit on the current board,
    // swap the first piece with a smaller playable shape so the player isn't unfairly eliminated by RNG
    if (fitnessChecker && !result.some((p) => fitnessChecker(p))) {
      const fallbackShapes = [
        PieceShapeType.DOT_1,
        PieceShapeType.LINE_2_H,
        PieceShapeType.LINE_2_V,
        PieceShapeType.CORNER_2X2_TL,
        PieceShapeType.LINE_3_H
      ];
      for (const shape of fallbackShapes) {
        const fallbackPiece = createPiece(createPieceShape(shape), getRandomPlayableColor(), SpecialBlockType.NONE);
        if (fitnessChecker(fallbackPiece)) {
          result[0] = fallbackPiece;
          break;
        }
      }
    }

    return result;
  }
}
