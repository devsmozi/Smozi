package com.example.game

import com.example.models.BlockColor
import com.example.models.Piece
import com.example.models.PieceShape
import com.example.models.PieceShapeType
import com.example.models.SpecialBlockType
import kotlin.random.Random

class PieceEngine {

    private val commonShapes = listOf(
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
    )

    private val complexShapes = listOf(
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
    )

    fun generatePieceTrio(includeSpecials: Boolean = true): List<Piece> {
        val result = mutableListOf<Piece>()
        // Guarantee at least one smaller, highly playable shape to reduce early game overs
        val shapePool = mutableListOf<PieceShapeType>()
        shapePool.add(commonShapes.random())
        
        // 2nd piece: common or complex
        if (Random.nextFloat() < 0.35f) {
            shapePool.add(complexShapes.random())
        } else {
            shapePool.add(commonShapes.random())
        }

        // 3rd piece: random
        if (Random.nextFloat() < 0.25f) {
            shapePool.add(complexShapes.random())
        } else {
            shapePool.add(commonShapes.random())
        }

        // Assign distinct colors where possible
        val availableColors = BlockColor.playableColors.shuffled().toMutableList()

        for (shapeType in shapePool) {
            val color = if (availableColors.isNotEmpty()) availableColors.removeAt(0) else BlockColor.randomPlayable()
            var specialType = SpecialBlockType.NONE

            if (includeSpecials && Random.nextFloat() < 0.12f) {
                specialType = when (Random.nextInt(4)) {
                    0 -> SpecialBlockType.BOMB
                    1 -> SpecialBlockType.ROCKET_ROW
                    2 -> SpecialBlockType.ROCKET_COL
                    else -> SpecialBlockType.RAINBOW
                }
            }

            result.add(
                Piece(
                    shape = PieceShape.fromType(shapeType),
                    color = color,
                    specialType = specialType
                )
            )
        }

        return result
    }
}
