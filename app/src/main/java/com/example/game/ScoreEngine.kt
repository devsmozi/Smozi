package com.example.game

data class ScoreBreakdown(
    val placementPoints: Int,
    val linePoints: Int,
    val comboBonus: Int,
    val totalPoints: Int,
    val feedbackText: String?,
    val comboPercent: String? = null
)

class ScoreEngine {

    fun calculateScore(
        blocksPlaced: Int,
        linesCleared: Int,
        comboCount: Int
    ): ScoreBreakdown {
        // Placement points match casual game pace from video (1 point per block or 10 pts)
        val placementPoints = blocksPlaced
        val linePoints = when (linesCleared) {
            0 -> 0
            1 -> 10
            2 -> 25
            3 -> 50
            4 -> 100
            else -> 100 + (linesCleared - 4) * 40
        }

        val comboBonus = if (linesCleared > 0 && comboCount > 1) {
            (comboCount - 1) * 15
        } else {
            0
        }

        val totalPoints = placementPoints + linePoints + comboBonus

        val feedbackText = when {
            linesCleared >= 4 || comboCount >= 4 -> "Amazing!"
            linesCleared == 3 || comboCount == 3 -> "Excellent!"
            linesCleared == 2 || comboCount == 2 -> "Great!"
            linesCleared == 1 && comboCount == 1 -> if (Math.random() > 0.5) "Smooth!" else "Good!"
            linesCleared == 1 -> "Good!"
            else -> null
        }

        val comboPercent = when {
            linesCleared >= 3 || comboCount >= 3 -> "140%"
            linesCleared == 2 || comboCount == 2 -> if (comboCount > 2) "80%" else "40%"
            else -> null
        }

        return ScoreBreakdown(
            placementPoints = placementPoints,
            linePoints = linePoints,
            comboBonus = comboBonus,
            totalPoints = totalPoints,
            feedbackText = feedbackText,
            comboPercent = comboPercent
        )
    }
}

class ComboEngine {
    var currentCombo: Int = 0
        private set

    fun registerMove(linesCleared: Int): Int {
        if (linesCleared > 0) {
            currentCombo++
        } else {
            currentCombo = 0
        }
        return currentCombo
    }

    fun reset() {
        currentCombo = 0
    }
}
