package com.example.models

enum class GameMode {
    CLASSIC,
    ADVENTURE,
    DAILY_CHALLENGE
}

enum class ObjectiveType(val label: String) {
    SCORE("Reach Score"),
    CLEAR_COLOR("Clear Color Blocks"),
    CLEAR_SPECIAL("Clear Special Blocks"),
    COLLECT_GEMS("Collect Gems"),
    CLEAR_ALL("Clear Entire Board")
}

data class LevelObjective(
    val type: ObjectiveType,
    val targetAmount: Int,
    var currentAmount: Int = 0,
    val targetColor: BlockColor? = null,
    val targetSpecial: SpecialBlockType? = null
) {
    val isCompleted: Boolean
        get() = currentAmount >= targetAmount
}

data class LevelData(
    val id: Int,
    val worldId: Int = 1,
    val title: String,
    val initialBoard: Map<Pair<Int, Int>, CellState> = emptyMap(),
    val objective: LevelObjective,
    val moveLimit: Int,
    val rewardCoins: Int = 50,
    val rewardGems: Int = 1,
    val starThresholds: Triple<Int, Int, Int> = Triple(500, 1000, 1500),
    val difficulty: String = "Normal"
)

data class Achievement(
    val id: String,
    val title: String,
    val description: String,
    val currentProgress: Int = 0,
    val targetValue: Int,
    val isUnlocked: Boolean = false,
    val rewardCoins: Int,
    val rewardGems: Int
)

data class PlayerData(
    val classicHighScore: Int = 0,
    val coins: Int = 1234,
    val gems: Int = 50,
    val lives: Int = 5,
    val currentLevel: Int = 1,
    val unlockedLevels: Set<Int> = setOf(1),
    val levelStars: Map<Int, Int> = emptyMap(),
    val levelHighScores: Map<Int, Int> = emptyMap(),
    val dailyStreak: Int = 1,
    val lastDailyClaimTimestamp: Long = 0L,
    val soundEnabled: Boolean = true,
    val musicEnabled: Boolean = true,
    val vibrationEnabled: Boolean = true,
    val selectedTheme: String = "Forest",
    val achievements: Map<String, Int> = emptyMap()
)
