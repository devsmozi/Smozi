import React, { useState, useEffect, useRef } from 'react';
import { GameMode, PlayerData } from './models/GameModels.ts';
import { getSkinTheme } from './models/SkinTheme.ts';
import { AudioManager } from './systems/AudioManager.ts';
import { HapticManager } from './systems/HapticManager.ts';
import { SaveManager } from './systems/SaveManager.ts';
import { MainMenuScreen } from './screens/MainMenuScreen.tsx';
import { AdventureMapScreen } from './screens/AdventureMapScreen.tsx';
import { GameScreen } from './screens/GameScreen.tsx';
import { SettingsDialog } from './components/SettingsDialog.tsx';
import { DailyRewardDialog } from './components/DailyRewardDialog.tsx';
import { AchievementsDialog } from './components/AchievementsDialog.tsx';

type ScreenType = 'MENU' | 'ADVENTURE_MAP' | 'GAME';

export const App: React.FC = () => {
  const saveManagerRef = useRef<SaveManager>(new SaveManager());
  const audioManagerRef = useRef<AudioManager>(new AudioManager());
  const hapticManagerRef = useRef<HapticManager>(new HapticManager());

  const [playerData, setPlayerData] = useState<PlayerData>(() =>
    saveManagerRef.current.loadPlayerData()
  );

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('MENU');
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.CLASSIC);
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);

  // Menu Modals
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showDailyReward, setShowDailyReward] = useState<boolean>(false);
  const [showAchievements, setShowAchievements] = useState<boolean>(false);

  // Sync settings
  useEffect(() => {
    audioManagerRef.current.isSoundEnabled = playerData.soundEnabled;
    audioManagerRef.current.isMusicEnabled = playerData.musicEnabled;
    hapticManagerRef.current.isEnabled = playerData.vibrationEnabled;
  }, [playerData.soundEnabled, playerData.musicEnabled, playerData.vibrationEnabled]);

  const handleUpdatePlayerData = (updated: PlayerData) => {
    setPlayerData(updated);
    saveManagerRef.current.savePlayerData(updated);
  };

  const startClassicGame = () => {
    setGameMode(GameMode.CLASSIC);
    setCurrentScreen('GAME');
  };

  const startAdventureLevel = (levelId: number) => {
    setGameMode(GameMode.ADVENTURE);
    setSelectedLevelId(levelId);
    setCurrentScreen('GAME');
  };

  const startDailyChallenge = () => {
    setGameMode(GameMode.DAILY_CHALLENGE);
    setCurrentScreen('GAME');
  };

  const handleClaimDailyReward = (coins: number, gems: number) => {
    const nextStreak = playerData.dailyStreak >= 7 ? 1 : playerData.dailyStreak + 1;
    const updated: PlayerData = {
      ...playerData,
      coins: playerData.coins + coins,
      gems: playerData.gems + gems,
      dailyStreak: nextStreak,
      lastDailyClaimTimestamp: Date.now()
    };
    handleUpdatePlayerData(updated);
    audioManagerRef.current.playGemCollect();
    hapticManagerRef.current.celebration();
  };

  const currentSkin = getSkinTheme(playerData.selectedTheme);

  return (
    <div
      className="w-full h-full min-h-screen text-white overflow-hidden select-none transition-colors duration-300"
      style={{
        background: currentSkin.backgroundGradient
      }}
    >
      {currentScreen === 'MENU' && (
        <MainMenuScreen
          playerData={playerData}
          onUpdatePlayerData={handleUpdatePlayerData}
          onStartClassic={startClassicGame}
          onOpenAdventure={() => setCurrentScreen('ADVENTURE_MAP')}
          onStartDailyChallenge={startDailyChallenge}
          onOpenSettings={() => setShowSettings(true)}
          onOpenDailyReward={() => setShowDailyReward(true)}
          onOpenAchievements={() => setShowAchievements(true)}
        />
      )}

      {currentScreen === 'ADVENTURE_MAP' && (
        <AdventureMapScreen
          playerData={playerData}
          onSelectLevel={startAdventureLevel}
          onBack={() => setCurrentScreen('MENU')}
        />
      )}

      {currentScreen === 'GAME' && (
        <GameScreen
          mode={gameMode}
          initialLevelId={selectedLevelId}
          playerData={playerData}
          audioManager={audioManagerRef.current}
          hapticManager={hapticManagerRef.current}
          saveManager={saveManagerRef.current}
          onUpdatePlayerData={handleUpdatePlayerData}
          onNavigateHome={() => setCurrentScreen('MENU')}
        />
      )}

      {/* Global Modals from Main Menu */}
      {showSettings && (
        <SettingsDialog
          playerData={playerData}
          onToggleSound={(enabled) =>
            handleUpdatePlayerData({ ...playerData, soundEnabled: enabled })
          }
          onToggleMusic={(enabled) =>
            handleUpdatePlayerData({ ...playerData, musicEnabled: enabled })
          }
          onToggleVibration={(enabled) =>
            handleUpdatePlayerData({ ...playerData, vibrationEnabled: enabled })
          }
          onSelectTheme={(themeId) =>
            handleUpdatePlayerData({ ...playerData, selectedTheme: themeId })
          }
          onDismiss={() => setShowSettings(false)}
        />
      )}

      {showDailyReward && (
        <DailyRewardDialog
          playerData={playerData}
          onClaim={handleClaimDailyReward}
          onDismiss={() => setShowDailyReward(false)}
        />
      )}

      {showAchievements && (
        <AchievementsDialog
          playerData={playerData}
          onDismiss={() => setShowAchievements(false)}
        />
      )}
    </div>
  );
};

export default App;
