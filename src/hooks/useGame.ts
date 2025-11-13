import { useState, useCallback, useRef, useEffect } from 'react'
import { sounds, playSound } from '../utils/audio'

export interface LevelConfig {
  grid: number
  path: number
  showTime: number
}

const levelConfigs: LevelConfig[] = [
  { grid: 3, path: 3, showTime: 2000 },  // Level 1
  { grid: 3, path: 4, showTime: 2000 },  // Level 2
  { grid: 4, path: 4, showTime: 2000 },  // Level 3
  { grid: 4, path: 5, showTime: 1800 },  // Level 4
  { grid: 4, path: 6, showTime: 1800 },  // Level 5
  { grid: 5, path: 6, showTime: 1800 },  // Level 6
  { grid: 5, path: 7, showTime: 1600 },  // Level 7
  { grid: 5, path: 8, showTime: 1600 },  // Level 8
  { grid: 6, path: 8, showTime: 1500 },  // Level 9
  { grid: 6, path: 9, showTime: 1500 },  // Level 10
  { grid: 6, path: 10, showTime: 1400 }, // Level 11
  { grid: 7, path: 10, showTime: 1400 }, // Level 12
  { grid: 7, path: 11, showTime: 1300 }, // Level 13
  { grid: 7, path: 12, showTime: 1300 }, // Level 14
  { grid: 8, path: 12, showTime: 1200 }  // Level 15
]

export type Screen = 'menu' | 'howToPlay' | 'game' | 'levelComplete' | 'gameOver'

export function useGame() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu')
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [correctPath, setCorrectPath] = useState<number[]>([])
  const [playerPath, setPlayerPath] = useState<number[]>([])
  const [gridSize, setGridSize] = useState(3)
  const [pathLength, setPathLength] = useState(3)
  const [highlightedTile, setHighlightedTile] = useState<number | null>(null)
  const [isShowingPath, setIsShowingPath] = useState(false)
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const [tileStates, setTileStates] = useState<Record<number, 'correct' | 'wrong' | null>>({})
  const [bonusPoints, setBonusPoints] = useState(0)
  const [levelStartTime, setLevelStartTime] = useState<number>(0)

  const pathTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const tilesRef = useRef<HTMLDivElement>(null)
  const onLevelCompleteRef = useRef<((level: number, startTime: number, endTime: number, score: number, lives: number) => void) | null>(null)

  const getNeighbors = useCallback((pos: number, gridSize: number): number[] => {
    const neighbors: number[] = []
    const row = Math.floor(pos / gridSize)
    const col = pos % gridSize
    
    if (row > 0) neighbors.push(pos - gridSize)
    if (row < gridSize - 1) neighbors.push(pos + gridSize)
    if (col > 0) neighbors.push(pos - 1)
    if (col < gridSize - 1) neighbors.push(pos + 1)

    return neighbors
  }, [])

  const generatePath = useCallback((length: number, gridSize: number): number[] => {
    const path: number[] = []
    const gridArea = gridSize * gridSize
    
    let currentPos = Math.floor(Math.random() * gridArea)
    path.push(currentPos)

    while (path.length < length) {
      const neighbors = getNeighbors(currentPos, gridSize)
      const validNeighbors = neighbors.filter(pos => !path.includes(pos))

      if (validNeighbors.length === 0) {
        return generatePath(length, gridSize)
      }
      
      currentPos = validNeighbors[Math.floor(Math.random() * validNeighbors.length)]
      path.push(currentPos)
    }

    return path
  }, [getNeighbors])

  const showPathToPlayer = useCallback((path: number[], showTime: number) => {
    setIsShowingPath(true)
    setIsPlayerTurn(false)
    setHighlightedTile(null)
    setTileStates({})
    setPlayerPath([])

    let i = 0
    const delay = 500

    const highlightNextTile = () => {
      if (i < path.length) {
        setHighlightedTile(path[i])
        playSound(sounds.click)

        i++
        pathTimeoutRef.current = setTimeout(highlightNextTile, delay)
      } else {
        setHighlightedTile(null)
        setIsShowingPath(false)
        setIsPlayerTurn(true)
        // Record level start time when player can start interacting
        const startTime = Math.floor(Date.now() / 1000)
        setLevelStartTime(startTime)
      }
    }

    highlightNextTile()
  }, [])

  const setupLevel = useCallback(() => {
    const config = levelConfigs[currentLevel - 1] || levelConfigs[levelConfigs.length - 1]
    setGridSize(config.grid)
    setPathLength(config.path)
    setTileStates({})
    setPlayerPath([])

    const path = generatePath(config.path, config.grid)
    setCorrectPath(path)

    setTimeout(() => {
      showPathToPlayer(path, config.showTime)
    }, 100)
  }, [currentLevel, generatePath, showPathToPlayer])

  const handleTileClick = useCallback((index: number) => {
    if (!isPlayerTurn || isShowingPath) return

    playSound(sounds.click)
    
    if (index === correctPath[playerPath.length]) {
      const newPlayerPath = [...playerPath, index]
      setPlayerPath(newPlayerPath)
      setTileStates(prev => ({ ...prev, [index]: 'correct' }))
      
      if (newPlayerPath.length === correctPath.length) {
        setIsPlayerTurn(false)
        const levelScore = currentLevel * 50
        const newScore = score + levelScore
        setScore(newScore)
        
        const bonus = currentLevel * 100 + lives * 50
        setBonusPoints(bonus)
        const finalScore = newScore + bonus
        setScore(finalScore)
        
        // Record level end time and publish to Somnia if callback is set
        const endTime = Math.floor(Date.now() / 1000)
        console.log('📊 Level complete! Callback exists?', !!onLevelCompleteRef.current)
        if (onLevelCompleteRef.current) {
          console.log('📤 Calling level complete callback with:', { currentLevel, levelStartTime, endTime, finalScore, lives })
          onLevelCompleteRef.current(currentLevel, levelStartTime, endTime, finalScore, lives)
        } else {
          console.warn('⚠️ No level complete callback registered!')
        }
        
        playSound(sounds.correct)
        setTimeout(() => {
          playSound(sounds.levelComplete)
          setTimeout(() => {
            playSound(sounds.applause)
          }, 500)
        }, 500)
        
        setTimeout(() => {
          setCurrentScreen('levelComplete')
        }, 800)
      } else {
        playSound(sounds.correct)
      }
    } else {
      setTileStates(prev => ({ ...prev, [index]: 'wrong' }))
      const newLives = lives - 1
      setLives(newLives)

      if (newLives <= 0) {
        setIsPlayerTurn(false)
        playSound(sounds.wrong)
        setTimeout(() => {
          playSound(sounds.gameOver)
          setCurrentScreen('gameOver')
        }, 800)
      } else {
        playSound(sounds.wrong)
        setTimeout(() => {
          setPlayerPath([])
          setTileStates({})
        }, 800)
      }
    }
  }, [isPlayerTurn, isShowingPath, correctPath, playerPath, currentLevel, lives, score, levelStartTime])

  const startGame = useCallback(() => {
    setCurrentLevel(1)
    setScore(0)
    setLives(3)
    setCurrentScreen('game')
    setTimeout(() => {
      setupLevel()
    }, 100)
  }, [setupLevel])

  const restartLevel = useCallback(() => {
    if (pathTimeoutRef.current) {
      clearTimeout(pathTimeoutRef.current)
    }
    setPlayerPath([])
    setTileStates({})
    setupLevel()
  }, [setupLevel])

  const nextLevel = useCallback(() => {
    if (pathTimeoutRef.current) {
      clearTimeout(pathTimeoutRef.current)
    }

    const newLevel = currentLevel + 1
    if (newLevel > levelConfigs.length) {
      setCurrentScreen('gameOver')
      return
    }
    
    setCurrentLevel(newLevel)
    setCurrentScreen('game')
    setTimeout(() => {
      setupLevel()
    }, 100)
  }, [currentLevel, setupLevel])

  const playAgain = useCallback(() => {
    startGame()
  }, [startGame])

  const showHowToPlay = useCallback(() => {
    setCurrentScreen('howToPlay')
  }, [])

  const showMenu = useCallback(() => {
    if (pathTimeoutRef.current) {
      clearTimeout(pathTimeoutRef.current)
    }
    setCurrentScreen('menu')
  }, [])

  const returnToMenu = useCallback(() => {
    if (pathTimeoutRef.current) {
      clearTimeout(pathTimeoutRef.current)
    }
    setCurrentScreen('menu')
  }, [])

  useEffect(() => {
    return () => {
      if (pathTimeoutRef.current) {
        clearTimeout(pathTimeoutRef.current)
      }
    }
  }, [])

  // Set callback for level completion (for Somnia publishing)
  const setOnLevelComplete = useCallback((callback: (level: number, startTime: number, endTime: number, score: number, lives: number) => void) => {
    onLevelCompleteRef.current = callback
  }, [])

  return {
    currentScreen,
    currentLevel,
    score,
    lives,
    correctPath,
    playerPath,
    gridSize,
    pathLength,
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
    setOnLevelComplete,
  }
}

