interface GameOverScreenProps {
  level: number
  score: number
  onPlayAgain: () => void
}

export default function GameOverScreen({ 
  level, 
  score, 
  onPlayAgain 
}: GameOverScreenProps) {
  return (
    <div className="game-over-screen active">
      <h2>Game Over</h2>
      <p>You reached level {level}</p>
      <p>Final score: {score}</p>
      <button onClick={onPlayAgain}>Play Again</button>
    </div>
  )
}

