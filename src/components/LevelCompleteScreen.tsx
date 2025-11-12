interface LevelCompleteScreenProps {
  score: number
  bonus: number
  onNextLevel: () => void
}

export default function LevelCompleteScreen({ 
  score, 
  bonus, 
  onNextLevel 
}: LevelCompleteScreenProps) {
  return (
    <div className="level-complete-screen active">
      <h2>Level Complete!</h2>
      <p>Score: {score - bonus}</p>
      <p>Bonus: <span className="bonus-points">{bonus}</span></p>
      <button onClick={onNextLevel}>Next Level</button>
    </div>
  )
}

