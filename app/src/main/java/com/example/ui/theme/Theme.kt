package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val SmoziColorScheme = darkColorScheme(
    primary = Color(0xFF007AFF),
    onPrimary = Color.White,
    primaryContainer = Color(0xFF1E3585),
    onPrimaryContainer = Color(0xFFD6E4FF),
    secondary = Color(0xFFFFCC00),
    onSecondary = Color(0xFF261900),
    secondaryContainer = Color(0xFFFF9500),
    tertiary = Color(0xFF34C759),
    onTertiary = Color.White,
    background = Color(0xFF090E29),
    onBackground = Color.White,
    surface = Color(0xFF131D4A),
    onSurface = Color.White,
    surfaceVariant = Color(0xFF1F2F6E),
    onSurfaceVariant = Color(0xFFA5B4FC)
)

@Composable
fun SmoziTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = SmoziColorScheme,
        typography = Typography,
        content = content
    )
}
