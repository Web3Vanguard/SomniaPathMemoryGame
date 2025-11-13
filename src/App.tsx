import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/walletConfig'
import { useGame } from './hooks/useGame'
import { useSomnia } from './hooks/useSomnia'
import MenuScreen from './components/MenuScreen'
import HowToPlayScreen from './components/HowToPlayScreen'
import GameScreen from './components/GameScreen'
import LevelCompleteScreen from './components/LevelCompleteScreen'
import GameOverScreen from './components/GameOverScreen'
import GameHistory from './components/GameHistory'
import Leaderboard from './components/Leaderboard'
import { useEffect } from 'react'

const queryClient = new QueryClient()

function GameContent() {
  const {
    currentScreen,
    currentLevel,
    score,
    lives,
    correctPath,
    playerPath,
    gridSize,
    highlightedTile,
    isShowingPath,
    isPlayerTurn,
    tileStates,
    bonusPoints,
    startGame,
    restartLevel,
    nextLevel,
    playAgain,
    showHowToPlay,
    showHistory,
    showLeaderboard,
    showMenu,
    returnToMenu,
    handleTileClick,
    setOnLevelComplete,
  } = useGame()

  // Initialize Somnia and set up level completion callback
  const { 
    publishLevelCompletion, 
    isEnabled: isSomniaEnabled, 
    isInitialized: isSomniaInitialized,
    isPublishing,
    lastPublishError,
    publishSuccess,
    fetchPlayerHistory,
    fetchLeaderboard,
    currentAddress
  } = useSomnia()

  console.log(isSomniaEnabled, isSomniaInitialized);

  useEffect(() => {
    if (isSomniaEnabled && isSomniaInitialized) {
      console.log('🔧 Setting up Somnia level completion callback')
      setOnLevelComplete((level, startTime, endTime, score, lives) => {
        console.log('🎯 Level complete callback triggered!', { level, startTime, endTime, score, lives })
        publishLevelCompletion(level, startTime, endTime, score, lives)
          .then((success) => {
            if (success) {
              console.log(`✅ Level ${level} completion published to Somnia`)
            } else {
              console.warn(`⚠️ Failed to publish level ${level} completion to Somnia`)
            }
          })
          .catch((error) => {
            console.error('Error publishing to Somnia:', error)
          })
      })
    }
  }, [isSomniaEnabled, isSomniaInitialized, publishLevelCompletion, setOnLevelComplete])

  return (
    <div className="game-container">
      {currentScreen === 'menu' && (
        <MenuScreen
          onStartGame={startGame}
          onShowHowToPlay={showHowToPlay}
          onShowHistory={showHistory}
          onShowLeaderboard={showLeaderboard}
        />
      )}

      {currentScreen === 'howToPlay' && (
        <HowToPlayScreen onBackToMenu={showMenu} />
      )}

      {currentScreen === 'history' && (
        <GameHistory
          fetchHistory={fetchPlayerHistory}
          isEnabled={isSomniaEnabled && isSomniaInitialized}
          onClose={showMenu}
        />
      )}

      {currentScreen === 'leaderboard' && (
        <Leaderboard
          fetchLeaderboard={fetchLeaderboard}
          isEnabled={isSomniaEnabled && isSomniaInitialized}
          currentAddress={currentAddress}
          onClose={showMenu}
        />
      )}

      {currentScreen === 'game' && (
        <GameScreen
          level={currentLevel}
          score={score}
          lives={lives}
          gridSize={gridSize}
          correctPath={correctPath}
          playerPath={playerPath}
          highlightedTile={highlightedTile}
          isShowingPath={isShowingPath}
          isPlayerTurn={isPlayerTurn}
          tileStates={tileStates}
          onTileClick={handleTileClick}
          onRestart={restartLevel}
          onReturnToMenu={returnToMenu}
        />
      )}

      {currentScreen === 'levelComplete' && (
        <LevelCompleteScreen
          score={score}
          bonus={bonusPoints}
          isPublishingToSomnia={isPublishing}
          somniaPublishError={lastPublishError}
          somniaPublishSuccess={publishSuccess}
          somniaEnabled={isSomniaEnabled}
          onNextLevel={nextLevel}
        />
      )}

      {currentScreen === 'gameOver' && (
        <GameOverScreen
          level={currentLevel}
          score={score}
          onPlayAgain={playAgain}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <GameContent />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App

