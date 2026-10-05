package com.example.game

import com.example.models.BlockColor
import com.example.models.CellState
import com.example.models.Piece
import com.example.models.SpecialBlockType

class BoardEngine {
    companion object {
        const val BOARD_SIZE = 8
    }

    private var grid: Array<Array<CellState>> = Array(BOARD_SIZE) { r ->
        Array(BOARD_SIZE) { c ->
            CellState(row = r, col = c)
        }
    }

    fun getBoard(): List<List<CellState>> {
        return grid.map { it.toList() }
    }

    fun getCell(row: Int, col: Int): CellState? {
        if (row !in 0 until BOARD_SIZE || col !in 0 until BOARD_SIZE) return null
        return grid[row][col]
    }

    fun setCell(row: Int, col: Int, state: CellState) {
        if (row in 0 until BOARD_SIZE && col in 0 until BOARD_SIZE) {
            grid[row][col] = state
        }
    }

    fun resetBoard() {
        for (r in 0 until BOARD_SIZE) {
            for (c in 0 until BOARD_SIZE) {
                grid[r][c] = CellState(row = r, col = c)
            }
        }
    }

    fun loadInitialBoard(initialCells: Map<Pair<Int, Int>, CellState>) {
        resetBoard()
        initialCells.forEach { (coord, cell) ->
            if (coord.first in 0 until BOARD_SIZE && coord.second in 0 until BOARD_SIZE) {
                grid[coord.first][coord.second] = cell
            }
        }
    }

    fun canPlace(piece: Piece, startRow: Int, startCol: Int): Boolean {
        val matrix = piece.shape.matrix
        for (r in matrix.indices) {
            for (c in matrix[r].indices) {
                if (matrix[r][c]) {
                    val boardR = startRow + r
                    val boardC = startCol + c
                    if (boardR !in 0 until BOARD_SIZE || boardC !in 0 until BOARD_SIZE) {
                        return false
                    }
                    if (grid[boardR][boardC].isOccupied) {
                        return false
                    }
                }
            }
        }
        return true
    }

    fun placePiece(piece: Piece, startRow: Int, startCol: Int): Boolean {
        if (!canPlace(piece, startRow, startCol)) return false
        val matrix = piece.shape.matrix
        for (r in matrix.indices) {
            for (c in matrix[r].indices) {
                if (matrix[r][c]) {
                    val boardR = startRow + r
                    val boardC = startCol + c
                    grid[boardR][boardC] = CellState(
                        row = boardR,
                        col = boardC,
                        isOccupied = true,
                        color = piece.color,
                        specialType = piece.specialType
                    )
                }
            }
        }
        return true
    }

    fun clearCell(row: Int, col: Int) {
        if (row in 0 until BOARD_SIZE && col in 0 until BOARD_SIZE) {
            grid[row][col] = CellState(row = row, col = col)
        }
    }

    fun clone(): BoardEngine {
        val cloned = BoardEngine()
        for (r in 0 until BOARD_SIZE) {
            for (c in 0 until BOARD_SIZE) {
                cloned.grid[r][c] = this.grid[r][c]
            }
        }
        return cloned
    }
}
