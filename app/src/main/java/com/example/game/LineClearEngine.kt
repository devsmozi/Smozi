package com.example.game

import com.example.models.BlockColor
import com.example.models.CellState
import com.example.models.SpecialBlockType

data class ClearResult(
    val linesClearedCount: Int,
    val clearedRows: List<Int>,
    val clearedCols: List<Int>,
    val clearedCells: Set<Pair<Int, Int>>,
    val specialEffectsTriggered: List<Pair<Pair<Int, Int>, SpecialBlockType>>,
    val gemsCollected: Map<SpecialBlockType, Int>,
    val blocksDestroyedCount: Int
)

class LineClearEngine(private val boardEngine: BoardEngine) {

    fun checkAndClearLines(): ClearResult {
        val completedRows = mutableListOf<Int>()
        val completedCols = mutableListOf<Int>()

        // 1. Check all rows
        for (r in 0 until BoardEngine.BOARD_SIZE) {
            var rowComplete = true
            for (c in 0 until BoardEngine.BOARD_SIZE) {
                val cell = boardEngine.getCell(r, c)
                if (cell == null || !cell.isOccupied) {
                    rowComplete = false
                    break
                }
            }
            if (rowComplete) {
                completedRows.add(r)
            }
        }

        // 2. Check all columns
        for (c in 0 until BoardEngine.BOARD_SIZE) {
            var colComplete = true
            for (r in 0 until BoardEngine.BOARD_SIZE) {
                val cell = boardEngine.getCell(r, c)
                if (cell == null || !cell.isOccupied) {
                    colComplete = false
                    break
                }
            }
            if (colComplete) {
                completedCols.add(c)
            }
        }

        val totalLines = completedRows.size + completedCols.size
        if (totalLines == 0) {
            return ClearResult(
                linesClearedCount = 0,
                clearedRows = emptyList(),
                clearedCols = emptyList(),
                clearedCells = emptySet(),
                specialEffectsTriggered = emptyList(),
                gemsCollected = emptyMap(),
                blocksDestroyedCount = 0
            )
        }

        // Collect all cells in the completed rows and columns
        val cellsToClear = mutableSetOf<Pair<Int, Int>>()
        for (r in completedRows) {
            for (c in 0 until BoardEngine.BOARD_SIZE) {
                cellsToClear.add(r to c)
            }
        }
        for (c in completedCols) {
            for (r in 0 until BoardEngine.BOARD_SIZE) {
                cellsToClear.add(r to c)
            }
        }

        val gemsCollected = mutableMapOf<SpecialBlockType, Int>()
        val specialEffects = mutableListOf<Pair<Pair<Int, Int>, SpecialBlockType>>()
        val secondaryCellsToClear = mutableSetOf<Pair<Int, Int>>()

        // Process special blocks inside cleared cells
        for (coord in cellsToClear) {
            val cell = boardEngine.getCell(coord.first, coord.second) ?: continue
            when (cell.specialType) {
                SpecialBlockType.GEM_BLUE, SpecialBlockType.GEM_RED, SpecialBlockType.GEM_GREEN -> {
                    gemsCollected[cell.specialType] = (gemsCollected[cell.specialType] ?: 0) + 1
                }
                SpecialBlockType.BOMB -> {
                    specialEffects.add(coord to SpecialBlockType.BOMB)
                    for (dr in -1..1) {
                        for (dc in -1..1) {
                            val nr = coord.first + dr
                            val nc = coord.second + dc
                            if (nr in 0 until BoardEngine.BOARD_SIZE && nc in 0 until BoardEngine.BOARD_SIZE) {
                                secondaryCellsToClear.add(nr to nc)
                            }
                        }
                    }
                }
                SpecialBlockType.ROCKET_ROW -> {
                    specialEffects.add(coord to SpecialBlockType.ROCKET_ROW)
                    for (c in 0 until BoardEngine.BOARD_SIZE) {
                        secondaryCellsToClear.add(coord.first to c)
                    }
                }
                SpecialBlockType.ROCKET_COL -> {
                    specialEffects.add(coord to SpecialBlockType.ROCKET_COL)
                    for (r in 0 until BoardEngine.BOARD_SIZE) {
                        secondaryCellsToClear.add(r to coord.second)
                    }
                }
                SpecialBlockType.RAINBOW, SpecialBlockType.COLOR_BALL -> {
                    specialEffects.add(coord to SpecialBlockType.RAINBOW)
                    // Clear all blocks on board sharing this cell's primary color
                    val targetColor = cell.color
                    if (targetColor != BlockColor.NONE) {
                        for (r in 0 until BoardEngine.BOARD_SIZE) {
                            for (c in 0 until BoardEngine.BOARD_SIZE) {
                                val other = boardEngine.getCell(r, c)
                                if (other != null && other.isOccupied && other.color == targetColor) {
                                    secondaryCellsToClear.add(r to c)
                                }
                            }
                        }
                    }
                }
                else -> {}
            }
        }

        // Also check adjacent wooden boxes and damaged obstacles
        val finalCellsToClear = cellsToClear + secondaryCellsToClear
        for (coord in finalCellsToClear) {
            val cell = boardEngine.getCell(coord.first, coord.second) ?: continue
            if (cell.specialType == SpecialBlockType.ICE && cell.durability > 1) {
                // Ice cracks once before breaking
                boardEngine.setCell(coord.first, coord.second, cell.copy(durability = 1))
            } else {
                boardEngine.clearCell(coord.first, coord.second)
            }
        }

        return ClearResult(
            linesClearedCount = totalLines,
            clearedRows = completedRows,
            clearedCols = completedCols,
            clearedCells = finalCellsToClear,
            specialEffectsTriggered = specialEffects,
            gemsCollected = gemsCollected,
            blocksDestroyedCount = finalCellsToClear.size
        )
    }
}
