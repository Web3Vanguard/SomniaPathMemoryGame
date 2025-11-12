import WalletConnect from './WalletConnect'

interface GameScreenProps {
  level: number
  score: number
  lives: number
  gridSize: number
  correctPath: number[]
  playerPath: number[]
  highlightedTile: number | null
  isShowingPath: boolean
  isPlayerTurn: boolean
  tileStates: Record<number, 'correct' | 'wrong' | null>
  onTileClick: (index: number) => void
  onRestart: () => void
  onReturnToMenu: () => void
}

export default function GameScreen({
  level,
  score,
  lives,
  gridSize,
  correctPath,
  playerPath,
  highlightedTile,
  isShowingPath,
  isPlayerTurn,
  tileStates,
  onTileClick,
  onRestart,
  onReturnToMenu,
}: GameScreenProps) {
  const getTileClass = (index: number) => {
    let className = 'tile'
    
    // Show highlighted tile during path display
    if (highlightedTile === index) {
      className += ' highlight'
    }
    
    // Show correct/wrong states
    if (tileStates[index] === 'correct') {
      className += ' correct'
    } else if (tileStates[index] === 'wrong') {
      className += ' wrong'
    }
    
    return className
  }

  return (
    <div className="game-screen active">
      <WalletConnect />
      <div className="game-header">
        <div className="level-display">Level: {level}</div>
        <div className="score-display">Score: {score}</div>
        <div className="lives-display">Lives: {lives}</div>
      </div>
      
      <div 
        className="grid-container"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }, (_, i) => (
          <div
            key={i}
            className={getTileClass(i)}
            onClick={() => onTileClick(i)}
            style={{
              pointerEvents: isPlayerTurn && !isShowingPath ? 'auto' : 'none',
              cursor: isPlayerTurn && !isShowingPath ? 'pointer' : 'default',
            }}
          />
        ))}
      </div>
      
      <div className="game-controls">
        <button onClick={onRestart}>Restart Level</button>
        <button onClick={onReturnToMenu}>Main Menu</button>
      </div>
    </div>
  )
}

