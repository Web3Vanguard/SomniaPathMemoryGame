interface HowToPlayScreenProps {
  onBackToMenu: () => void
}

export default function HowToPlayScreen({ onBackToMenu }: HowToPlayScreenProps) {
  return (
    <div className="how-to-play-screen active">
      <h2>How to Play</h2>
      <div className="instructions">
        <p>1. Watch the path shown by the highlighted tiles</p>
        <p>2. Remember the sequence</p>
        <p>3. Repeat the path by clicking the tiles in order</p>
        <p>4. Complete all levels to win!</p>
      </div>
      <button onClick={onBackToMenu}>Back to Menu</button>
    </div>
  )
}

