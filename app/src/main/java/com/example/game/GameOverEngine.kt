package com.example.game

import com.example.models.Piece

class GameOverEngine(private val boardEngine: BoardEngine) {

    /**
     * Returns true only if NONE of the available pieces can fit anywhere on the 8x8 board.
     * If even one valid placement exists for any available piece, returns false.
     */
    fun isGameOver(availablePieces: List<Piece?>): Boolean {
        val nonNullPieces = availablePieces.filterNotNull()
        if (nonNullPieces.isEmpty()) {
            // All 3 pieces were placed, new ones will spawn, so not game over.
            return false
        }

        for (piece in nonNullPieces) {
            if (canPieceFitAnywhere(piece)) {
                return false
            }
        }

        return true
    }

    fun canPieceFitAnywhere(piece: Piece): Boolean {
        val maxStartRow = BoardEngine.BOARD_SIZE - piece.shape.height
        val maxStartCol = BoardEngine.BOARD_SIZE - piece.shape.width

        if (maxStartRow < 0 || maxStartCol < 0) return false

        for (r in 0..maxStartRow) {
            for (c in 0..maxStartCol) {
                if (boardEngine.canPlace(piece, r, c)) {
                    return true
                }
            }
        }
        return false
    }
}
