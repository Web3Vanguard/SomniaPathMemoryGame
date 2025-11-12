import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { mainnet, sepolia, somniaTestnet } from 'wagmi/chains'
import { http } from 'wagmi'

// Get projectId from environment variable
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || ''

if (!projectId) {
  console.warn('VITE_WALLET_CONNECT_PROJECT_ID is not set. Please set it in your .env file.')
  console.warn('Get your project ID from https://cloud.walletconnect.com')
}

// Create metadata
const metadata = {
  name: 'Path Memory Game',
  description: 'A memory game with blockchain wallet integration',
  url: window.location.origin,
  icons: [`${window.location.origin}/favicon.ico`]
}

// Create wagmi config
export const config = defaultWagmiConfig({
  chains: [mainnet, sepolia, somniaTestnet],
  projectId,
  metadata,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [somniaTestnet.id]: http(),
  },
})

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
  enableOnramp: false,
  themeMode: 'dark',
})

