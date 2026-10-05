package com.example.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

enum class SmoziButtonStyle(
    val topColor: Color,
    val bottomColor: Color,
    val borderColor: Color,
    val shadowColor: Color
) {
    GREEN(
        topColor = Color(0xFF4CD964),
        bottomColor = Color(0xFF28CD41),
        borderColor = Color(0xFF86E49D),
        shadowColor = Color(0xFF1B8A2B)
    ),
    YELLOW_ORANGE(
        topColor = Color(0xFFFFCC00),
        bottomColor = Color(0xFFFF9500),
        borderColor = Color(0xFFFFE680),
        shadowColor = Color(0xFFB36600)
    ),
    PURPLE(
        topColor = Color(0xFFAF52DE),
        bottomColor = Color(0xFF8944AB),
        borderColor = Color(0xFFD396F1),
        shadowColor = Color(0xFF5A1E7A)
    ),
    BLUE(
        topColor = Color(0xFF007AFF),
        bottomColor = Color(0xFF0051B3),
        borderColor = Color(0xFF68B1FF),
        shadowColor = Color(0xFF003380)
    ),
    RED(
        topColor = Color(0xFFFF3B30),
        bottomColor = Color(0xFFD62217),
        borderColor = Color(0xFFFF857D),
        shadowColor = Color(0xFF8F120A)
    )
}

@Composable
fun SmoziButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    style: SmoziButtonStyle = SmoziButtonStyle.GREEN,
    testTag: String = "smozi_button",
    icon: (@Composable () -> Unit)? = null
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(targetValue = if (isPressed) 0.94f else 1.0f, label = "button_scale")

    Box(
        modifier = modifier
            .scale(scale)
            .shadow(
                elevation = if (isPressed) 2.dp else 6.dp,
                shape = RoundedCornerShape(22.dp),
                spotColor = style.shadowColor
            )
            .clip(RoundedCornerShape(22.dp))
            .background(
                Brush.verticalGradient(
                    colors = listOf(style.topColor, style.bottomColor)
                )
            )
            .border(
                width = 2.dp,
                color = style.borderColor,
                shape = RoundedCornerShape(22.dp)
            )
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick
            )
            .defaultMinSize(minHeight = 52.dp)
            .padding(horizontal = 20.dp, vertical = 10.dp)
            .testTag(testTag),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 4.dp)
        ) {
            if (icon != null) {
                icon()
            }
            Text(
                text = text,
                style = TextStyle(
                    fontSize = 20.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color.White,
                    shadow = Shadow(
                        color = style.shadowColor,
                        offset = Offset(0f, 3f),
                        blurRadius = 3f
                    )
                )
            )
        }
    }
}

@Composable
fun SmoziIconButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    style: SmoziButtonStyle = SmoziButtonStyle.BLUE,
    size: Dp = 48.dp,
    testTag: String = "smozi_icon_button",
    content: @Composable () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(targetValue = if (isPressed) 0.92f else 1.0f, label = "icon_btn_scale")

    Box(
        modifier = modifier
            .scale(scale)
            .defaultMinSize(minWidth = size, minHeight = size)
            .shadow(
                elevation = if (isPressed) 2.dp else 6.dp,
                shape = CircleShape,
                spotColor = style.shadowColor
            )
            .clip(CircleShape)
            .background(
                Brush.verticalGradient(listOf(style.topColor, style.bottomColor))
            )
            .border(width = 2.dp, color = style.borderColor, shape = CircleShape)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick
            )
            .testTag(testTag),
        contentAlignment = Alignment.Center
    ) {
        content()
    }
}
