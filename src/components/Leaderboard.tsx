import { useState, useEffect, useCallback } from 'react'

interface LeaderboardEntry {
  address: string
  highestLevel: number
  totalScore: number
  completions: number
}

interface LeaderboardProps {
  fetchLeaderboard: () => Promise<LeaderboardEntry[]>
  isEnabled: boolean
  currentAddress?: string
  onClose: () => void
}

export default function Leaderboard({ fetchLeaderboard, isEnabled, currentAddress, onClose }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchLeaderboard()
      setLeaderboard(data)
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchLeaderboard])

  useEffect(() => {
    if (isEnabled) {
      loadLeaderboard()
    }
  }, [isEnabled, loadLeaderboard])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isCurrentPlayer = (address: string) => {
    return currentAddress && address.toLowerCase() === currentAddress.toLowerCase()
  }

  if (!isEnabled) {
    return (
      <div className="leaderboard active">
        <div className="leaderboard-header">
          <h2>🏆 Leaderboard</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <p className="leaderboard-unavailable">
          Connect your wallet and enable Somnia to view the leaderboard
        </p>
      </div>
    )
  }

  return (
    <div className="leaderboard active">
      <div className="leaderboard-header">
        <h2>🏆 Leaderboard</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      {isLoading ? (
        <p className="loading">⏳ Loading leaderboard...</p>
      ) : leaderboard.length === 0 ? (
        <div className="no-leaderboard">
          <p>📊 No players on the leaderboard yet.</p>
          <p style={{ fontSize: '0.7rem', marginTop: '10px', opacity: 0.8 }}>
            Complete a level to appear on the leaderboard!
          </p>
        </div>
      ) : (
        <div className="leaderboard-list">
          <div className="leaderboard-table-header">
            <span className="rank-col">Rank</span>
            <span className="player-col">Player</span>
            <span className="level-col">Level</span>
            <span className="score-col">Score</span>
          </div>
          {leaderboard.map((entry, index) => (
            <div 
              key={entry.address} 
              className={`leaderboard-entry ${isCurrentPlayer(entry.address) ? 'current-player' : ''} ${index < 3 ? `rank-${index + 1}` : ''}`}
            >
              <span className="rank">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `#${index + 1}`}
              </span>
              <span className="player">
                {formatAddress(entry.address)}
                {isCurrentPlayer(entry.address) && <span className="you-badge">YOU</span>}
              </span>
              <span className="level">{entry.highestLevel}</span>
              <span className="score">{entry.totalScore.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
