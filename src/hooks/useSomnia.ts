import { useEffect, useState, useCallback } from 'react'
import { usePublicClient, useWalletClient, useAccount } from 'wagmi'
import { somniaService } from '../services/somniaService'
import { LevelCompletionData } from '../types/somnia'
import { dreamChain } from '../config/somniaChain'
import { createPublicClient, createWalletClient, http } from 'viem'

const isSomniaEnabled = import.meta.env.VITE_SOMNIA_ENABLED === 'true'

export function useSomnia() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient({ chainId: dreamChain.id })
  const { data: walletClient } = useWalletClient({ chainId: dreamChain.id })
  const [isInitialized, setIsInitialized] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [lastPublishError, setLastPublishError] = useState<string | null>(null)
  const [lastPublishedLevel, setLastPublishedLevel] = useState<number | null>(null)
  const [publishSuccess, setPublishSuccess] = useState(false)

  /**
   * Initialize Somnia service when wallet is connected
   */
  useEffect(() => {
    if (!isSomniaEnabled) {
      console.log('Somnia data streams disabled')
      return
    }

    if (!isConnected || !address) {
      somniaService.reset()
      setIsInitialized(false)
      return
    }

    const initializeSomnia = async () => {
      try {
        console.log('🔧 Initializing Somnia...', { isConnected, address, hasWalletClient: !!walletClient })
        
        const somniaPublicClient = createPublicClient({
          chain: dreamChain,
          transport: http(),
        })

        // Use the wagmi wallet client directly - it's already connected to the user's wallet
        const somniaWalletClient = walletClient || null

        console.log('🔧 Created clients:', { hasPublicClient: !!somniaPublicClient, hasWalletClient: !!somniaWalletClient })

        await somniaService.initialize(somniaPublicClient, somniaWalletClient)
        setIsInitialized(true)
        setLastPublishError(null)
        console.log('✅ Somnia initialized, isReady:', somniaService.isReady())
      } catch (error) {
        console.error('Failed to initialize Somnia:', error)
        setLastPublishError(error instanceof Error ? error.message : 'Unknown error')
        setIsInitialized(false)
      }
    }

    initializeSomnia()
  }, [isConnected, address, walletClient])

  /**
   * Publish level completion data to Somnia
   */
  const publishLevelCompletion = useCallback(async (
    level: number,
    startTime: number,
    endTime: number,
    score: number,
    lives: number
  ): Promise<boolean> => {
    console.log('🚀 publishLevelCompletion called', { level, startTime, endTime, score, lives })
    console.log('🔍 Checks:', { isSomniaEnabled, isInitialized, address, isReady: somniaService.isReady() })
    
    if (!isSomniaEnabled || !isInitialized || !address) {
      console.log('❌ Somnia not available or wallet not connected')
      return false
    }

    if (!somniaService.isReady()) {
      console.warn('❌ Somnia service not ready')
      return false
    }

    console.log('✅ All checks passed, setting publishing state...')
    setIsPublishing(true)
    setLastPublishError(null)
    setPublishSuccess(false)
    setLastPublishedLevel(level)

    try {
      const data: LevelCompletionData = {
        playerAddress: address,
        levelCompleted: level,
        startTime,
        endTime,
        score,
        livesRemaining: lives,
      }

      const txHash = await somniaService.publishLevelCompletion(data)
      
      if (txHash) {
        console.log(`✅ Level ${level} completion published successfully: ${txHash}`)
        
        // Add player to known players list for leaderboard
        if (address) {
          const knownPlayers = JSON.parse(localStorage.getItem('knownPlayers') || '[]')
          if (!knownPlayers.includes(address)) {
            knownPlayers.push(address)
            localStorage.setItem('knownPlayers', JSON.stringify(knownPlayers))
          }
        }
        
        setIsPublishing(false)
        setPublishSuccess(true)
        setLastPublishError(null)
        // Clear success message after a delay
        setTimeout(() => {
          setPublishSuccess(false)
        }, 5000)
        return true
      } else {
        const errorMsg = 'Failed to publish: No transaction hash returned. Wallet may need to sign the transaction.'
        setLastPublishError(errorMsg)
        setIsPublishing(false)
        setPublishSuccess(false)
        console.warn(`⚠️ ${errorMsg}`)
        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred while publishing'
      console.error('Error publishing level completion:', error)
      setLastPublishError(errorMessage)
      setIsPublishing(false)
      setPublishSuccess(false)
      return false
    }
  }, [isInitialized, address])

  /**
   * Fetch player's game history
   */
  const fetchPlayerHistory = useCallback(async () => {
    if (!isSomniaEnabled || !isInitialized || !address) {
      console.log('Cannot fetch history: Somnia not available or wallet not connected')
      return []
    }

    try {
      return await somniaService.fetchPlayerHistory(address)
    } catch (error) {
      console.error('Error fetching player history:', error)
      return []
    }
  }, [isInitialized, address])

  /**
   * Add current player to known players list
   */
  const addPlayerToLeaderboard = useCallback(() => {
    if (!address) return
    
    const knownPlayers = JSON.parse(localStorage.getItem('knownPlayers') || '[]')
    if (!knownPlayers.includes(address)) {
      knownPlayers.push(address)
      localStorage.setItem('knownPlayers', JSON.stringify(knownPlayers))
    }
  }, [address])

  /**
   * Fetch leaderboard
   */
  const fetchLeaderboard = useCallback(async () => {
    if (!isSomniaEnabled || !isInitialized) {
      console.log('Cannot fetch leaderboard: Somnia not available')
      return []
    }

    try {
      // Get list of known players from localStorage
      const knownPlayers = JSON.parse(localStorage.getItem('knownPlayers') || '[]')
      
      if (knownPlayers.length === 0) {
        console.log('No known players yet')
        return []
      }
      
      return await somniaService.fetchLeaderboard(knownPlayers)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
  }, [isInitialized])

  return {
    isEnabled: isSomniaEnabled,
    isInitialized,
    isReady: somniaService.isReady(),
    isPublishing,
    lastPublishError,
    publishSuccess,
    lastPublishedLevel,
    publishLevelCompletion,
    fetchPlayerHistory,
    fetchLeaderboard,
    currentAddress: address,
  }
}

