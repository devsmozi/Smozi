package com.example

import com.example.data.LevelsData
import com.example.game.BoardEngine
import com.example.game.GameOverEngine
import com.example.game.LineClearEngine
import com.example.game.ScoreEngine
import com.example.models.BlockColor
import com.example.models.Piece
import com.example.models.PieceShape
import com.example.models.PieceShapeType
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ExampleUnitTest {

    @Test
    fun testBoardEngineDimensionsAndPlacement() {
        val board = BoardEngine()
        assertEquals(8, BoardEngine.BOARD_SIZE)

        val dotPiece = Piece(
            shape = PieceShape.fromType(PieceShapeType.DOT_1),
            color = BlockColor.BLUE
        )

        // Valid placement at 0, 0
        assertTrue(board.canPlace(dotPiece, 0, 0))
        assertTrue(board.placePiece(dotPiece, 0, 0))

        // Cannot place on already occupied cell
        assertFalse(board.canPlace(dotPiece, 0, 0))

        // Out of bounds placement
        assertFalse(board.canPlace(dotPiece, 8, 8))
    }

    @Test
    fun testSimultaneousLineClear() {
        val board = BoardEngine()
        val lineClearEngine = LineClearEngine(board)

        // Fill row 0 completely
        for (c in 0 until 8) {
            val p = Piece(shape = PieceShape.fromType(PieceShapeType.DOT_1), color = BlockColor.RED)
            board.placePiece(p, 0, c)
        }

        // Fill col 0 completely
        for (r in 1 until 8) {
            val p = Piece(shape = PieceShape.fromType(PieceShapeType.DOT_1), color = BlockColor.GREEN)
            board.placePiece(p, r, 0)
        }

        val result = lineClearEngine.checkAndClearLines()
        assertEquals(2, result.linesClearedCount)
        assertEquals(listOf(0), result.clearedRows)
        assertEquals(listOf(0), result.clearedCols)
        // 8 row cells + 7 col cells = 15 unique cells cleared
        assertEquals(15, result.clearedCells.size)
    }

    @Test
    fun testScoreEngine() {
        val scoreEngine = ScoreEngine()
        val score = scoreEngine.calculateScore(blocksPlaced = 4, linesCleared = 2, comboCount = 2)

        assertEquals(4, score.placementPoints)
        assertEquals(25, score.linePoints)
        assertEquals(15, score.comboBonus)
        assertEquals(44, score.totalPoints)
        assertEquals("Great!", score.feedbackText)
        assertEquals("40%", score.comboPercent)
    }

    @Test
    fun testGameOverDetection() {
        val board = BoardEngine()
        val gameOverEngine = GameOverEngine(board)

        val dotPiece = Piece(
            shape = PieceShape.fromType(PieceShapeType.DOT_1),
            color = BlockColor.YELLOW
        )

        // On empty board, dot fits
        assertFalse(gameOverEngine.isGameOver(listOf(dotPiece)))

        // Fill entire board
        for (r in 0 until 8) {
            for (c in 0 until 8) {
                board.placePiece(dotPiece, r, c)
            }
        }

        // Full board, no pieces fit
        assertTrue(gameOverEngine.isGameOver(listOf(dotPiece)))
    }

    @Test
    fun test50AdventureLevelsData() {
        assertEquals(50, LevelsData.allLevels.size)
        val level1 = LevelsData.getLevel(1)
        assertEquals(1, level1.id)
        assertEquals(1, level1.worldId)
        assertNotNull(level1.objective)
        assertTrue(level1.moveLimit > 0)

        val level50 = LevelsData.getLevel(50)
        assertEquals(50, level50.id)
        assertEquals(5, level50.worldId)
        assertNotNull(level50.objective)
        assertEquals("The Grandmaster", level50.title)

        // Verify themes
        assertEquals(6, com.example.models.SkinThemes.allThemes.size)
    }
}
