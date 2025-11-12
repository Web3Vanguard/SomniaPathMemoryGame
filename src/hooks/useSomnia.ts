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
        const somniaPublicClient = createPublicClient({
          chain: dreamChain,
          transport: http(),
        })

        const somniaWalletClient = walletClient 
          ? createWalletClient({
              account: walletClient.account,
              chain: dreamChain,
              transport: http(),
            })
          : null

        await somniaService.initialize(somniaPublicClient, somniaWalletClient)
        setIsInitialized(true)
        setLastPublishError(null)
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
    if (!isSomniaEnabled || !isInitialized || !address) {
      console.log('Somnia not available or wallet not connected')
      return false
    }

    if (!somniaService.isReady()) {
      console.warn('Somnia service not ready')
      return false
    }

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

  return {
    isEnabled: isSomniaEnabled,
    isInitialized,
    isReady: somniaService.isReady(),
    isPublishing,
    lastPublishError,
    publishSuccess,
    lastPublishedLevel,
    publishLevelCompletion,
  }
}

