package com.example.models

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

data class SkinTheme(
    val id: String,
    val name: String,
    val description: String,
    val backgroundBrush: Brush,
    val boardBackground: Color,
    val boardBorder: Color,
    val gridLineColor: Color,
    val emptyCellColor: Color,
    val primaryAccent: Color,
    val crownColor: Color = Color(0xFFFFD700)
)

object SkinThemes {
    val CLASSIC_NAVY = SkinTheme(
        id = "Classic Navy",
        name = "Classic Navy",
        description = "Signature Block Blast deep royal blue canvas with midnight board",
        backgroundBrush = Brush.verticalGradient(
            listOf(Color(0xFF2C4C87), Color(0xFF203763), Color(0xFF17294A))
        ),
        boardBackground = Color(0xFF10172B),
        boardBorder = Color(0xFF1B2A4E),
        gridLineColor = Color(0xFF1A2645),
        emptyCellColor = Color(0xFF141D33),
        primaryAccent = Color(0xFF2979FF)
    )

    val NEON_NIGHT = SkinTheme(
        id = "Neon Night",
        name = "Neon Night",
        description = "Cyberpunk dark violet canvas with electric neon glow",
        backgroundBrush = Brush.verticalGradient(
            listOf(Color(0xFF1B0B3B), Color(0xFF100624), Color(0xFF090314))
        ),
        boardBackground = Color(0xFF120526),
        boardBorder = Color(0xFF3D147A),
        gridLineColor = Color(0xFF250C4E),
        emptyCellColor = Color(0xFF180733),
        primaryAccent = Color(0xFFD500F9)
    )

    val WOODEN_TIMBER = SkinTheme(
        id = "Wooden Timber",
        name = "Wooden Timber",
        description = "Warm rich mahogany wood tones with polished brass accents",
        backgroundBrush = Brush.verticalGradient(
            listOf(Color(0xFF332014), Color(0xFF24160E), Color(0xFF180E09))
        ),
        boardBackground = Color(0xFF1A0F0A),
        boardBorder = Color(0xFF4A2D1B),
        gridLineColor = Color(0xFF2E1A11),
        emptyCellColor = Color(0xFF20130C),
        primaryAccent = Color(0xFFFFB300)
    )

    val CANDY_WONDERLAND = SkinTheme(
        id = "Candy Wonderland",
        name = "Candy Wonderland",
        description = "Sweet pastel strawberry swirl with confectionary sparkles",
        backgroundBrush = Brush.verticalGradient(
            listOf(Color(0xFF421836), Color(0xFF2B0E23), Color(0xFF190714))
        ),
        boardBackground = Color(0xFF1E0A1A),
        boardBorder = Color(0xFF5E1E4E),
        gridLineColor = Color(0xFF381430),
        emptyCellColor = Color(0xFF260D21),
        primaryAccent = Color(0xFFFF4081)
    )

    val MYSTIC_FOREST = SkinTheme(
        id = "Mystic Forest",
        name = "Mystic Forest",
        description = "Lush emerald canopy with ancient moss stone grid",
        backgroundBrush = Brush.verticalGradient(
            listOf(Color(0xFF0F2E1B), Color(0xFF091C10), Color(0xFF051009))
        ),
        boardBackground = Color(0xFF0A1C12),
        boardBorder = Color(0xFF1B4E30),
        gridLineColor = Color(0xFF133622),
        emptyCellColor = Color(0xFF0D2418),
        primaryAccent = Color(0xFF00E676)
    )

    val VOLCANIC_MAGMA = SkinTheme(
        id = "Volcanic Magma",
        name = "Volcanic Magma",
        description = "Smoldering dark obsidian stone with fiery molten cracks",
        backgroundBrush = Brush.verticalGradient(
            listOf(Color(0xFF331010), Color(0xFF210909), Color(0xFF140505))
        ),
        boardBackground = Color(0xFF170606),
        boardBorder = Color(0xFF521717),
        gridLineColor = Color(0xFF330E0E),
        emptyCellColor = Color(0xFF210909),
        primaryAccent = Color(0xFFFF3D00)
    )

    val allThemes: List<SkinTheme> = listOf(
        CLASSIC_NAVY,
        NEON_NIGHT,
        WOODEN_TIMBER,
        CANDY_WONDERLAND,
        MYSTIC_FOREST,
        VOLCANIC_MAGMA
    )

    fun getTheme(id: String): SkinTheme {
        return allThemes.find { it.id.equals(id, ignoreCase = true) || it.name.equals(id, ignoreCase = true) }
            ?: CLASSIC_NAVY
    }
}
