import { createConfig, http } from 'wagmi'
import { walletConnect, injected } from 'wagmi/connectors'
import { mainnet, sepolia } from 'wagmi/chains'
import { dreamChain } from './somniaChain'

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || ''

if (!projectId) {
  console.warn('VITE_WALLET_CONNECT_PROJECT_ID is not set. Set it in your .env file.')
  console.warn('Get your Project ID from https://cloud.reown.com (formerly WalletConnect Cloud)')
}

// Create metadata
const metadata = {
  name: 'Path Memory Game',
  description: 'A memory game with blockchain wallet integration',
  url: window.location.origin,
  icons: [`${window.location.origin}/favicon.ico`]
}

// Create wagmi config with WalletConnect and injected wallet connectors
// This provides wallet connection functionality using WalletConnect protocol
export const config = createConfig({
  chains: [mainnet, sepolia, dreamChain],
  connectors: [
    walletConnect({ 
      projectId, 
      metadata, 
      showQrModal: true // Enable QR code modal for WalletConnect
    }),
    injected({ shimDisconnect: true }), // Support for MetaMask and other injected wallets
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [dreamChain.id]: http(),
  },
})

