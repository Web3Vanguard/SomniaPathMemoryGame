export interface LevelCompletionData {
  playerAddress: string
  levelCompleted: number
  startTime: number
  endTime: number
  score: number
  livesRemaining: number
}

export interface SomniaConfig {
  enabled: boolean
  schemaId?: string
}

