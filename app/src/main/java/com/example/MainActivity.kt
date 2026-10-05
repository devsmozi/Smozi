package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.example.game.GameViewModel
import com.example.ui.components.AchievementsDialog
import com.example.ui.components.DailyRewardDialog
import com.example.ui.components.SettingsDialog
import com.example.ui.screens.AdventureMapScreen
import com.example.ui.screens.GameScreen
import com.example.ui.screens.MainMenuScreen
import com.example.ui.theme.SmoziTheme

enum class ScreenState {
    MAIN_MENU,
    ADVENTURE_MAP,
    GAME_PLAY
}

class MainActivity : ComponentActivity() {

    private val gameViewModel: GameViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SmoziTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { _ ->
                    SmoziApp(gameViewModel = gameViewModel)
                }
            }
        }
    }
}

@Composable
fun SmoziApp(gameViewModel: GameViewModel) {
    var currentScreen by remember { mutableStateOf(ScreenState.MAIN_MENU) }
    var showSettingsDialog by remember { mutableStateOf(false) }
    var showDailyRewardDialog by remember { mutableStateOf(false) }
    var showAchievementsDialog by remember { mutableStateOf(false) }

    val playerData by gameViewModel.playerData.collectAsState()

    when (currentScreen) {
        ScreenState.MAIN_MENU -> {
            MainMenuScreen(
                playerData = playerData,
                onStartClassic = {
                    gameViewModel.startClassicGame()
                    currentScreen = ScreenState.GAME_PLAY
                },
                onOpenAdventure = {
                    currentScreen = ScreenState.ADVENTURE_MAP
                },
                onStartDailyChallenge = {
                    gameViewModel.startDailyChallenge()
                    currentScreen = ScreenState.GAME_PLAY
                },
                onOpenSettings = { showSettingsDialog = true },
                onOpenDailyReward = { showDailyRewardDialog = true },
                onOpenAchievements = { showAchievementsDialog = true }
            )
        }

        ScreenState.ADVENTURE_MAP -> {
            AdventureMapScreen(
                playerData = playerData,
                onSelectLevel = { levelId ->
                    gameViewModel.startAdventureLevel(levelId)
                    currentScreen = ScreenState.GAME_PLAY
                },
                onBack = {
                    currentScreen = ScreenState.MAIN_MENU
                }
            )
        }

        ScreenState.GAME_PLAY -> {
            GameScreen(
                viewModel = gameViewModel,
                onNavigateHome = {
                    currentScreen = ScreenState.MAIN_MENU
                },
                onNextLevel = { nextLevelId ->
                    if (nextLevelId <= 96) {
                        gameViewModel.startAdventureLevel(nextLevelId)
                    } else {
                        currentScreen = ScreenState.ADVENTURE_MAP
                    }
                }
            )
        }
    }

    if (showSettingsDialog) {
        SettingsDialog(
            playerData = playerData,
            onToggleSound = { gameViewModel.setSoundEnabled(it) },
            onToggleMusic = { gameViewModel.setMusicEnabled(it) },
            onToggleVibration = { gameViewModel.setVibrationEnabled(it) },
            onSelectTheme = { gameViewModel.setSelectedTheme(it) },
            onDismiss = { showSettingsDialog = false }
        )
    }

    if (showDailyRewardDialog) {
        DailyRewardDialog(
            playerData = playerData,
            onClaim = { coins, gems ->
                gameViewModel.claimDailyReward(coins, gems)
                showDailyRewardDialog = false
            },
            onDismiss = { showDailyRewardDialog = false }
        )
    }

    if (showAchievementsDialog) {
        AchievementsDialog(
            playerData = playerData,
            onDismiss = { showAchievementsDialog = false }
        )
    }
}
