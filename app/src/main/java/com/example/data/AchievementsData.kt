package com.example.data

import com.example.models.Achievement

object AchievementsData {
    val initialAchievements = listOf(
        Achievement(
            id = "first_win",
            title = "First Win",
            description = "Complete your first adventure level",
            targetValue = 1,
            rewardCoins = 100,
            rewardGems = 1
        ),
        Achievement(
            id = "block_master",
            title = "Block Master",
            description = "Place 100 blocks on the game board",
            targetValue = 100,
            rewardCoins = 150,
            rewardGems = 2
        ),
        Achievement(
            id = "line_crusher",
            title = "Line Crusher",
            description = "Clear 30 rows or columns",
            targetValue = 30,
            rewardCoins = 200,
            rewardGems = 2
        ),
        Achievement(
            id = "combo_master",
            title = "Combo Master",
            description = "Achieve a 4x combo in a single match",
            targetValue = 4,
            rewardCoins = 300,
            rewardGems = 3
        ),
        Achievement(
            id = "gem_collector",
            title = "Gem Collector",
            description = "Collect 20 gems from puzzle clearing",
            targetValue = 20,
            rewardCoins = 250,
            rewardGems = 5
        ),
        Achievement(
            id = "adventure_explorer",
            title = "Adventure Explorer",
            description = "Reach Level 10 in Adventure Mode",
            targetValue = 10,
            rewardCoins = 500,
            rewardGems = 5
        ),
        Achievement(
            id = "perfect_puzzler",
            title = "Perfect Puzzler",
            description = "Earn 3 stars on 5 different levels",
            targetValue = 5,
            rewardCoins = 400,
            rewardGems = 4
        ),
        Achievement(
            id = "high_scorer",
            title = "High Scorer",
            description = "Score over 2000 points in Classic Mode",
            targetValue = 2000,
            rewardCoins = 600,
            rewardGems = 10
        )
    )
}

data class DailyRewardItem(
    val day: Int,
    val title: String,
    val coins: Int,
    val gems: Int,
    val specialBonus: String? = null
)

object DailyRewardsData {
    val days = listOf(
        DailyRewardItem(day = 1, title = "Day 1", coins = 100, gems = 0),
        DailyRewardItem(day = 2, title = "Day 2", coins = 0, gems = 1),
        DailyRewardItem(day = 3, title = "Day 3", coins = 200, gems = 0),
        DailyRewardItem(day = 4, title = "Day 4", coins = 150, gems = 1, specialBonus = "Rocket Power-Up"),
        DailyRewardItem(day = 5, title = "Day 5", coins = 0, gems = 2, specialBonus = "Color Ball"),
        DailyRewardItem(day = 6, title = "Day 6", coins = 250, gems = 2),
        DailyRewardItem(day = 7, title = "Day 7", coins = 500, gems = 5, specialBonus = "Super Chest")
    )
}
