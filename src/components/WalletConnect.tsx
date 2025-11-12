import { useAccount } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()

  const handleClick = () => {
    open()
  }

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="wallet-connect-container">
      <button 
        className={`wallet-button ${isConnected ? 'connected' : ''}`}
        onClick={handleClick}
      >
        {isConnected ? `Connected: ${formatAddress(address)}` : 'Connect Wallet'}
      </button>
    </div>
  )
}

