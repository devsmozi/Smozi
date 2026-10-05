package com.example.models

enum class PieceShapeType {
    DOT_1,
    LINE_2_H,
    LINE_2_V,
    LINE_3_H,
    LINE_3_V,
    LINE_4_H,
    LINE_4_V,
    LINE_5_H,
    LINE_5_V,
    SQUARE_2X2,
    SQUARE_3X3,
    L_3X2_0,
    L_3X2_90,
    L_3X2_180,
    L_3X2_270,
    J_3X2_0,
    J_3X2_90,
    J_3X2_180,
    J_3X2_270,
    T_3X2_UP,
    T_3X2_DOWN,
    T_3X2_LEFT,
    T_3X2_RIGHT,
    S_H,
    S_V,
    Z_H,
    Z_V,
    CORNER_2X2_TL,
    CORNER_2X2_TR,
    CORNER_2X2_BL,
    CORNER_2X2_BR,
    CROSS_3X3
}

data class PieceShape(
    val type: PieceShapeType,
    val name: String,
    val matrix: List<List<Boolean>>
) {
    val height: Int = matrix.size
    val width: Int = if (matrix.isNotEmpty()) matrix[0].size else 0
    val blockCount: Int = matrix.sumOf { row -> row.count { it } }

    companion object {
        fun fromType(type: PieceShapeType): PieceShape {
            val matrix: List<List<Boolean>> = when (type) {
                PieceShapeType.DOT_1 -> listOf(
                    listOf(true)
                )
                PieceShapeType.LINE_2_H -> listOf(
                    listOf(true, true)
                )
                PieceShapeType.LINE_2_V -> listOf(
                    listOf(true),
                    listOf(true)
                )
                PieceShapeType.LINE_3_H -> listOf(
                    listOf(true, true, true)
                )
                PieceShapeType.LINE_3_V -> listOf(
                    listOf(true),
                    listOf(true),
                    listOf(true)
                )
                PieceShapeType.LINE_4_H -> listOf(
                    listOf(true, true, true, true)
                )
                PieceShapeType.LINE_4_V -> listOf(
                    listOf(true),
                    listOf(true),
                    listOf(true),
                    listOf(true)
                )
                PieceShapeType.LINE_5_H -> listOf(
                    listOf(true, true, true, true, true)
                )
                PieceShapeType.LINE_5_V -> listOf(
                    listOf(true),
                    listOf(true),
                    listOf(true),
                    listOf(true),
                    listOf(true)
                )
                PieceShapeType.SQUARE_2X2 -> listOf(
                    listOf(true, true),
                    listOf(true, true)
                )
                PieceShapeType.SQUARE_3X3 -> listOf(
                    listOf(true, true, true),
                    listOf(true, true, true),
                    listOf(true, true, true)
                )
                PieceShapeType.L_3X2_0 -> listOf(
                    listOf(true, false),
                    listOf(true, false),
                    listOf(true, true)
                )
                PieceShapeType.L_3X2_90 -> listOf(
                    listOf(true, true, true),
                    listOf(true, false, false)
                )
                PieceShapeType.L_3X2_180 -> listOf(
                    listOf(true, true),
                    listOf(false, true),
                    listOf(false, true)
                )
                PieceShapeType.L_3X2_270 -> listOf(
                    listOf(false, false, true),
                    listOf(true, true, true)
                )
                PieceShapeType.J_3X2_0 -> listOf(
                    listOf(false, true),
                    listOf(false, true),
                    listOf(true, true)
                )
                PieceShapeType.J_3X2_90 -> listOf(
                    listOf(true, false, false),
                    listOf(true, true, true)
                )
                PieceShapeType.J_3X2_180 -> listOf(
                    listOf(true, true),
                    listOf(true, false),
                    listOf(true, false)
                )
                PieceShapeType.J_3X2_270 -> listOf(
                    listOf(true, true, true),
                    listOf(false, false, true)
                )
                PieceShapeType.T_3X2_UP -> listOf(
                    listOf(false, true, false),
                    listOf(true, true, true)
                )
                PieceShapeType.T_3X2_DOWN -> listOf(
                    listOf(true, true, true),
                    listOf(false, true, false)
                )
                PieceShapeType.T_3X2_LEFT -> listOf(
                    listOf(false, true),
                    listOf(true, true),
                    listOf(false, true)
                )
                PieceShapeType.T_3X2_RIGHT -> listOf(
                    listOf(true, false),
                    listOf(true, true),
                    listOf(true, false)
                )
                PieceShapeType.S_H -> listOf(
                    listOf(false, true, true),
                    listOf(true, true, false)
                )
                PieceShapeType.S_V -> listOf(
                    listOf(true, false),
                    listOf(true, true),
                    listOf(false, true)
                )
                PieceShapeType.Z_H -> listOf(
                    listOf(true, true, false),
                    listOf(false, true, true)
                )
                PieceShapeType.Z_V -> listOf(
                    listOf(false, true),
                    listOf(true, true),
                    listOf(true, false)
                )
                PieceShapeType.CORNER_2X2_TL -> listOf(
                    listOf(true, true),
                    listOf(true, false)
                )
                PieceShapeType.CORNER_2X2_TR -> listOf(
                    listOf(true, true),
                    listOf(false, true)
                )
                PieceShapeType.CORNER_2X2_BL -> listOf(
                    listOf(true, false),
                    listOf(true, true)
                )
                PieceShapeType.CORNER_2X2_BR -> listOf(
                    listOf(false, true),
                    listOf(true, true)
                )
                PieceShapeType.CROSS_3X3 -> listOf(
                    listOf(false, true, false),
                    listOf(true, true, true),
                    listOf(false, true, false)
                )
            }
            return PieceShape(type = type, name = type.name, matrix = matrix)
        }
    }
}
