package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.models.BlockColor

@Composable
fun SmoziLogoView(modifier: Modifier = Modifier) {
    // Recreates the official 3D candy letter style logo with backed puzzle blocks (Image 4)
    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center
    ) {
        // Decorative background mini blocks backing the logo
        Row(
            modifier = Modifier.offset(y = (-14).dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            SmoziBlockView(color = BlockColor.YELLOW, modifier = Modifier.size(24.dp))
            SmoziBlockView(color = BlockColor.RED, modifier = Modifier.size(28.dp))
            SmoziBlockView(color = BlockColor.BLUE, modifier = Modifier.size(26.dp))
            SmoziBlockView(color = BlockColor.GREEN, modifier = Modifier.size(28.dp))
            SmoziBlockView(color = BlockColor.PURPLE, modifier = Modifier.size(24.dp))
        }

        // Candy 3D "SMOZI" letters
        Row(
            horizontalArrangement = Arrangement.spacedBy((-3).dp),
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(top = 10.dp)
        ) {
            CandyLetter(char = "S", startColor = Color(0xFFFFCC00), endColor = Color(0xFFFF9500))
            CandyLetter(char = "M", startColor = Color(0xFF68B1FF), endColor = Color(0xFF007AFF))
            CandyLetter(char = "O", startColor = Color(0xFFD396F1), endColor = Color(0xFFAF52DE))
            CandyLetter(char = "Z", startColor = Color(0xFFFFD600), endColor = Color(0xFFFF8800))
            CandyLetter(char = "I", startColor = Color(0xFF75E6E0), endColor = Color(0xFF00C7BE))
        }
    }
}

@Composable
private fun CandyLetter(char: String, startColor: Color, endColor: Color) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier.padding(horizontal = 2.dp)
    ) {
        // Outer dark shadow
        Text(
            text = char,
            style = TextStyle(
                fontSize = 46.sp,
                fontWeight = FontWeight.Black,
                color = Color(0xFF0A1138),
                shadow = Shadow(
                    color = Color(0xFF05081E),
                    offset = Offset(0f, 6f),
                    blurRadius = 8f
                )
            )
        )
        // Mid stroke
        Text(
            text = char,
            style = TextStyle(
                fontSize = 44.sp,
                fontWeight = FontWeight.Black,
                color = Color.White
            ),
            modifier = Modifier.offset(y = (-1).dp)
        )
        // Front candy fill
        Text(
            text = char,
            style = TextStyle(
                fontSize = 42.sp,
                fontWeight = FontWeight.Black,
                brush = Brush.verticalGradient(listOf(startColor, endColor))
            ),
            modifier = Modifier.offset(y = (-2).dp)
        )
    }
}
