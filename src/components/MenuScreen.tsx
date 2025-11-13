import WalletConnect from './WalletConnect'

interface MenuScreenProps {
  onStartGame: () => void
  onShowHowToPlay: () => void
  onShowHistory: () => void
  onShowLeaderboard: () => void
}

export default function MenuScreen({ onStartGame, onShowHowToPlay, onShowHistory, onShowLeaderboard }: MenuScreenProps) {
  return (
    <div className="menu-screen active">
      <WalletConnect />
      <h1>Somnia</h1>
      <h2>Path Memory Game</h2>
      <div className="menu-buttons">
        <button onClick={onStartGame}>Start Game</button>
        <button onClick={onShowHowToPlay}>How to Play</button>
        <button onClick={onShowHistory}>View History</button>
        <button onClick={onShowLeaderboard}>Leaderboard</button>
      </div>
    </div>
  )
}

