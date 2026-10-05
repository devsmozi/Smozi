package com.example.models

import androidx.compose.ui.graphics.Color

enum class BlockColor(
    val id: String,
    val primaryColor: Color,
    val lightBevelColor: Color,
    val darkBevelColor: Color,
    val specularColor: Color,
    val glowColor: Color
) {
    RED(
        id = "red",
        primaryColor = Color(0xFFFF2D55),
        lightBevelColor = Color(0xFFFF7A95),
        darkBevelColor = Color(0xFFC7002B),
        specularColor = Color(0xFFFFFFFF),
        glowColor = Color(0x80FF2D55)
    ),
    YELLOW(
        id = "yellow",
        primaryColor = Color(0xFFFFCC00),
        lightBevelColor = Color(0xFFFFE680),
        darkBevelColor = Color(0xFFD69E00),
        specularColor = Color(0xFFFFFFFF),
        glowColor = Color(0x80FFCC00)
    ),
    GREEN(
        id = "green",
        primaryColor = Color(0xFF34C759),
        lightBevelColor = Color(0xFF86E49D),
        darkBevelColor = Color(0xFF1E8738),
        specularColor = Color(0xFFFFFFFF),
        glowColor = Color(0x8034C759)
    ),
    BLUE(
        id = "blue",
        primaryColor = Color(0xFF007AFF),
        lightBevelColor = Color(0xFF68B1FF),
        darkBevelColor = Color(0xFF0051B3),
        specularColor = Color(0xFFFFFFFF),
        glowColor = Color(0x80007AFF)
    ),
    ORANGE(
        id = "orange",
        primaryColor = Color(0xFFFF9500),
        lightBevelColor = Color(0xFFFFC066),
        darkBevelColor = Color(0xFFC66900),
        specularColor = Color(0xFFFFFFFF),
        glowColor = Color(0x80FF9500)
    ),
    PURPLE(
        id = "purple",
        primaryColor = Color(0xFFAF52DE),
        lightBevelColor = Color(0xFFD396F1),
        darkBevelColor = Color(0xFF7A21AA),
        specularColor = Color(0xFFFFFFFF),
        glowColor = Color(0x80AF52DE)
    ),
    CYAN(
        id = "cyan",
        primaryColor = Color(0xFF00C7BE),
        lightBevelColor = Color(0xFF75E6E0),
        darkBevelColor = Color(0xFF008A84),
        specularColor = Color(0xFFFFFFFF),
        glowColor = Color(0x8000C7BE)
    ),
    PINK(
        id = "pink",
        primaryColor = Color(0xFFFF2D8D),
        lightBevelColor = Color(0xFFFF85BF),
        darkBevelColor = Color(0xFFB8005A),
        specularColor = Color(0xFFFFFFFF),
        glowColor = Color(0x80FF2D8D)
    ),
    RAINBOW(
        id = "rainbow",
        primaryColor = Color(0xFFFF3B30),
        lightBevelColor = Color(0xFFFFCC00),
        darkBevelColor = Color(0xFF5856D6),
        specularColor = Color(0xFFFFFFFF),
        glowColor = Color(0x80FFCC00)
    ),
    NONE(
        id = "none",
        primaryColor = Color.Transparent,
        lightBevelColor = Color.Transparent,
        darkBevelColor = Color.Transparent,
        specularColor = Color.Transparent,
        glowColor = Color.Transparent
    );

    companion object {
        val playableColors = listOf(RED, YELLOW, GREEN, BLUE, ORANGE, PURPLE, CYAN, PINK)
        
        fun randomPlayable(): BlockColor {
            return playableColors.random()
        }
    }
}
