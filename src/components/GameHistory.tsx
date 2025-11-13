import { useState, useEffect, useCallback } from 'react'
import { LevelCompletionData } from '../types/somnia'

interface GameHistoryProps {
  fetchHistory: () => Promise<LevelCompletionData[]>
  isEnabled: boolean
  onClose: () => void
}

export default function GameHistory({ fetchHistory, isEnabled, onClose }: GameHistoryProps) {
  const [history, setHistory] = useState<LevelCompletionData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchHistory()
      setHistory(data)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchHistory])

  useEffect(() => {
    if (isEnabled) {
      loadHistory()
    }
  }, [isEnabled, loadHistory])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const formatDuration = (startTime: number, endTime: number) => {
    const duration = endTime - startTime
    return `${duration}s`
  }

  if (!isEnabled) {
    return (
      <div className="game-history active">
        <div className="history-header">
          <h2>🎮 Game History</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <p className="history-unavailable">
          Connect your wallet and enable Somnia to view game history
        </p>
      </div>
    )
  }

  return (
    <div className="game-history active">
      <div className="history-header">
        <h2>🎮 Game History</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      {isLoading ? (
        <p className="loading">⏳ Loading history...</p>
      ) : history.length === 0 ? (
        <p className="no-history">📊 No game history found. Complete some levels to see your history!</p>
      ) : (
        <div className="history-list">
          {history.map((entry, index) => (
            <div key={index} className="history-entry">
              <div className="entry-header">
                <span className="level-badge">Level {entry.levelCompleted}</span>
                <span className="score">{entry.score} pts</span>
              </div>
              <div className="entry-details">
                <span>⏱️ {formatDuration(entry.startTime, entry.endTime)}</span>
                <span>❤️ {entry.livesRemaining} {entry.livesRemaining === 1 ? 'life' : 'lives'}</span>
              </div>
              <div className="entry-date">{formatDate(entry.endTime)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
