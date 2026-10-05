package com.example.game

import com.example.models.Piece

data class PlacementPreview(
    val isValid: Boolean,
    val targetRow: Int,
    val targetCol: Int,
    val occupiedCells: List<Pair<Int, Int>>
)

class PlacementEngine(private val boardEngine: BoardEngine) {

    fun calculatePlacement(
        piece: Piece,
        targetRow: Int,
        targetCol: Int
    ): PlacementPreview {
        val matrix = piece.shape.matrix
        val cellsToOccupy = mutableListOf<Pair<Int, Int>>()

        var isValid = true
        for (r in matrix.indices) {
            for (c in matrix[r].indices) {
                if (matrix[r][c]) {
                    val boardR = targetRow + r
                    val boardC = targetCol + c
                    if (boardR !in 0 until BoardEngine.BOARD_SIZE || boardC !in 0 until BoardEngine.BOARD_SIZE) {
                        isValid = false
                    } else {
                        cellsToOccupy.add(boardR to boardC)
                        val existing = boardEngine.getCell(boardR, boardC)
                        if (existing != null && existing.isOccupied) {
                            isValid = false
                        }
                    }
                }
            }
        }

        return PlacementPreview(
            isValid = isValid,
            targetRow = targetRow,
            targetCol = targetCol,
            occupiedCells = cellsToOccupy
        )
    }
}
