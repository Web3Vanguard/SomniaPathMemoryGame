import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/walletConfig'
import { useGame } from './hooks/useGame'
import MenuScreen from './components/MenuScreen'
import HowToPlayScreen from './components/HowToPlayScreen'
import GameScreen from './components/GameScreen'
import LevelCompleteScreen from './components/LevelCompleteScreen'
import GameOverScreen from './components/GameOverScreen'

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
    showMenu,
    returnToMenu,
    handleTileClick,
  } = useGame()

  return (
    <div className="game-container">
      {currentScreen === 'menu' && (
        <MenuScreen
          onStartGame={startGame}
          onShowHowToPlay={showHowToPlay}
        />
      )}

      {currentScreen === 'howToPlay' && (
        <HowToPlayScreen onBackToMenu={showMenu} />
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

