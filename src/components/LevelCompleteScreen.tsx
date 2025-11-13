interface LevelCompleteScreenProps {
  score: number
  bonus: number
  isPublishingToSomnia?: boolean
  somniaPublishError?: string | null
  somniaPublishSuccess?: boolean
  somniaEnabled?: boolean
  onNextLevel: () => void
}

export default function LevelCompleteScreen({ 
  score, 
  bonus, 
  isPublishingToSomnia = false,
  somniaPublishError = null,
  somniaPublishSuccess = false,
  somniaEnabled = false,
  onNextLevel 
}: LevelCompleteScreenProps) {
  
  console.log(score, bonus, isPublishingToSomnia, somniaPublishError, somniaPublishSuccess, somniaEnabled)

  return (
    <div className="level-complete-screen active">
      <h2>Level Complete!</h2>
      <p>Score: {score - bonus}</p>
      <p>Bonus: <span className="bonus-points">{bonus}</span></p>
      
      {somniaEnabled && (
        <div className="somnia-status">
          {isPublishingToSomnia && (
            <p className="somnia-publishing">
              📡 Publishing to Somnia blockchain...
            </p>
          )}
          {!isPublishingToSomnia && somniaPublishSuccess && !somniaPublishError && (
            <p className="somnia-success">
              ✅ Published to Somnia blockchain
            </p>
          )}
          {!isPublishingToSomnia && !somniaPublishSuccess && !somniaPublishError && (
            <p className="somnia-info">
              ℹ️ Somnia publishing unavailable
            </p>
          )}
          {somniaPublishError && (
            <p className="somnia-error" title={somniaPublishError}>
              ⚠️ Failed to publish: {somniaPublishError.length > 50 
                ? `${somniaPublishError.substring(0, 50)}...` 
                : somniaPublishError}
            </p>
          )}
        </div>
      )}
      
      <button onClick={onNextLevel} disabled={isPublishingToSomnia}>
        {isPublishingToSomnia ? 'Publishing...' : 'Next Level'}
      </button>
    </div>
  )
}

