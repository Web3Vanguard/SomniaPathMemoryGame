import { SDK, SchemaEncoder, zeroBytes32 } from '@somnia-chain/streams'
import { createPublicClient, createWalletClient, http, toHex, PublicClient, WalletClient, keccak256, toBytes } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { dreamChain } from '../config/somniaChain'
import { LevelCompletionData } from '../types/somnia'

const SOMNIA_PATH_SCHEMA = `address playerAddress, uint256 levelCompleted, uint256 startTime, uint256 endTime, uint256 score, uint256 livesRemaining`

class SomniaService {
  private sdk: SDK | null = null
  private schemaId: string | null = null
  private encoder: SchemaEncoder | null = null
  private isInitialized = false
  private publicClient: PublicClient | null = null
  private walletClient: WalletClient | null = null

  /**
   * Initialize the Somnia service with wallet clients
   */
  async initialize(publicClient: PublicClient, walletClient: WalletClient | null): Promise<void> {
    // If already initialized but wallet client changed, update it
    if (this.isInitialized && this.sdk && walletClient && !this.walletClient) {
      console.log('🔄 Updating wallet client...')
      this.walletClient = walletClient
      this.sdk = new SDK({ 
        public: publicClient,
        wallet: walletClient
      })
      console.log('✅ Wallet client updated, isReady:', this.isReady())
      return
    }

    if (this.isInitialized && this.sdk) {
      return
    }

    try {
      this.publicClient = publicClient
      this.walletClient = walletClient

      this.sdk = new SDK({ 
        public: publicClient,
        wallet: walletClient || undefined
      })

      this.schemaId = await this.sdk.streams.computeSchemaId(SOMNIA_PATH_SCHEMA)
      console.log('Somnia Schema ID:', this.schemaId)

      this.encoder = new SchemaEncoder(SOMNIA_PATH_SCHEMA)

      await this.registerSchema()

      this.isInitialized = true
      console.log('✅ Somnia service initialized')
    } catch (error) {
      console.error('Failed to initialize Somnia service:', error)
      throw error
    }
  }

  /**
   * Register the data schema on Somnia blockchain
   */
  private async registerSchema(): Promise<void> {
    if (!this.sdk || !this.schemaId) {
      throw new Error('SDK not initialized')
    }

    try {
      const txHash = await this.sdk.streams.registerDataSchemas(
        [
          {
            id: 'somniaDataPath',
            schema: SOMNIA_PATH_SCHEMA,
            parentSchemaId: zeroBytes32
          },
        ],
        false
      )

      if (txHash && this.publicClient) {
        await waitForTransactionReceipt(this.publicClient, { hash: txHash })
        console.log(`✅ Schema registered, Tx: ${txHash}`)
      } else {
        console.log('ℹ️ Schema already registered or no transaction needed')
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('SchemaAlreadyRegistered')) {
        console.log('ℹ️ Schema already registered. Continuing...')
      } else {
        console.error('Error registering schema:', error)
      }
    }
  }

  /**
   * Publish level completion data to Somnia blockchain
   */
  async publishLevelCompletion(data: LevelCompletionData): Promise<string | null> {
    console.log('📤 publishLevelCompletion called with:', data)
    console.log('📋 Service state:', { 
      isInitialized: this.isInitialized, 
      hasSdk: !!this.sdk, 
      hasSchemaId: !!this.schemaId, 
      hasEncoder: !!this.encoder,
      hasWalletClient: !!this.walletClient 
    })

    if (!this.isInitialized || !this.sdk || !this.schemaId || !this.encoder) {
      console.warn('❌ Somnia service not initialized. Cannot publish data.')
      return null
    }

    if (!this.walletClient) {
      console.warn('❌ Wallet not connected. Cannot publish to Somnia.')
      return null
    }

    try {
      console.log('🔐 Encoding data...')
      const encodedData = this.encoder.encodeData([
        { name: 'playerAddress', value: data.playerAddress, type: 'address' },
        { name: 'levelCompleted', value: BigInt(data.levelCompleted), type: 'uint256' },
        { name: 'startTime', value: BigInt(data.startTime), type: 'uint256' },
        { name: 'endTime', value: BigInt(data.endTime), type: 'uint256' },
        { name: 'score', value: BigInt(data.score), type: 'uint256' },
        { name: 'livesRemaining', value: BigInt(data.livesRemaining), type: 'uint256' },
      ])
      console.log('✅ Data encoded')

      // Create a unique stream ID by hashing the data (ensures 32 bytes)
      const streamIdString = `somniaPath-${data.playerAddress}-${data.levelCompleted}-${data.endTime}`
      const streamId = keccak256(toBytes(streamIdString))
      console.log('🆔 Stream ID:', streamId)

      // Publish to Somnia
      const dataStreams = [{ 
        id: streamId, 
        schemaId: this.schemaId, 
        data: encodedData 
      }]

      console.log('📡 Calling sdk.streams.set...')
      const txHash = await this.sdk.streams.set(dataStreams)
      console.log('📡 sdk.streams.set returned:', txHash)
      
      if (txHash) {
        console.log(`✅ Published level ${data.levelCompleted} completion to Somnia. Tx: ${txHash}`)
      } else {
        console.warn('⚠️ No transaction hash returned from sdk.streams.set')
      }
      return txHash
    } catch (error) {
      console.error('❌ Error publishing to Somnia:', error)
      return null
    }
  }

  /**
   * Check if Somnia service is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.sdk !== null && this.walletClient !== null
  }

  /**
   * Reset the service
   */
  reset(): void {
    this.sdk = null
    this.schemaId = null
    this.encoder = null
    this.isInitialized = false
    this.publicClient = null
    this.walletClient = null
  }
}

// Export singleton instance
export const somniaService = new SomniaService()

