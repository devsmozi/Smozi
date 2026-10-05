package com.example.systems

import android.content.Context
import android.content.SharedPreferences
import com.example.models.PlayerData
import org.json.JSONObject

class SaveManager(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences("smozi_game_save_v1", Context.MODE_PRIVATE)

    fun loadPlayerData(): PlayerData {
        val classicHighScore = prefs.getInt("classic_high_score", 0)
        val coins = prefs.getInt("coins", 1234)
        val gems = prefs.getInt("gems", 50)
        val lives = prefs.getInt("lives", 5)
        val currentLevel = prefs.getInt("current_level", 1)
        val dailyStreak = prefs.getInt("daily_streak", 1)
        val lastDailyClaimTimestamp = prefs.getLong("last_daily_claim", 0L)
        val soundEnabled = prefs.getBoolean("sound_enabled", true)
        val musicEnabled = prefs.getBoolean("music_enabled", true)
        val vibrationEnabled = prefs.getBoolean("vibration_enabled", true)
        val selectedTheme = prefs.getString("selected_theme", "Forest") ?: "Forest"

        val unlockedLevels = mutableSetOf(1)
        val unlockedLevelsRaw = prefs.getString("unlocked_levels", "1") ?: "1"
        unlockedLevelsRaw.split(",").mapNotNull { it.trim().toIntOrNull() }.forEach {
            unlockedLevels.add(it)
        }

        val levelStars = mutableMapOf<Int, Int>()
        val starsJson = prefs.getString("level_stars", "{}") ?: "{}"
        try {
            val json = JSONObject(starsJson)
            val keys = json.keys()
            while (keys.hasNext()) {
                val key = keys.next()
                levelStars[key.toInt()] = json.getInt(key)
            }
        } catch (_: Exception) {}

        val levelHighScores = mutableMapOf<Int, Int>()
        val highScoresJson = prefs.getString("level_high_scores", "{}") ?: "{}"
        try {
            val json = JSONObject(highScoresJson)
            val keys = json.keys()
            while (keys.hasNext()) {
                val key = keys.next()
                levelHighScores[key.toInt()] = json.getInt(key)
            }
        } catch (_: Exception) {}

        return PlayerData(
            classicHighScore = classicHighScore,
            coins = coins,
            gems = gems,
            lives = lives,
            currentLevel = currentLevel,
            unlockedLevels = unlockedLevels,
            levelStars = levelStars,
            levelHighScores = levelHighScores,
            dailyStreak = dailyStreak,
            lastDailyClaimTimestamp = lastDailyClaimTimestamp,
            soundEnabled = soundEnabled,
            musicEnabled = musicEnabled,
            vibrationEnabled = vibrationEnabled,
            selectedTheme = selectedTheme
        )
    }

    fun savePlayerData(data: PlayerData) {
        val editor = prefs.edit()
        editor.putInt("classic_high_score", data.classicHighScore)
        editor.putInt("coins", data.coins)
        editor.putInt("gems", data.gems)
        editor.putInt("lives", data.lives)
        editor.putInt("current_level", data.currentLevel)
        editor.putInt("daily_streak", data.dailyStreak)
        editor.putLong("last_daily_claim", data.lastDailyClaimTimestamp)
        editor.putBoolean("sound_enabled", data.soundEnabled)
        editor.putBoolean("music_enabled", data.musicEnabled)
        editor.putBoolean("vibration_enabled", data.vibrationEnabled)
        editor.putString("selected_theme", data.selectedTheme)
        editor.putString("unlocked_levels", data.unlockedLevels.joinToString(","))

        val starsJson = JSONObject()
        data.levelStars.forEach { (level, stars) ->
            starsJson.put(level.toString(), stars)
        }
        editor.putString("level_stars", starsJson.toString())

        val scoresJson = JSONObject()
        data.levelHighScores.forEach { (level, score) ->
            scoresJson.put(level.toString(), score)
        }
        editor.putString("level_high_scores", scoresJson.toString())

        editor.apply()
    }
}
