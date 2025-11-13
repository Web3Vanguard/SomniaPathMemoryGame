import { useState, useEffect, useRef } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [showConnectors, setShowConnectors] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowConnectors(false)
      }
    }

    if (showConnectors) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showConnectors])

  const handleClick = () => {
    if (isConnected) {
      disconnect()
    } else {
      setShowConnectors(!showConnectors)
    }
  }

  const handleConnectorClick = (connectorId: string) => {
    const selectedConnector = connectors.find(c => c.id === connectorId)
    if (selectedConnector) {
      connect({ connector: selectedConnector })
      setShowConnectors(false)
    }
  }

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="wallet-connect-container" ref={menuRef}>
      <button 
        className={`wallet-button ${isConnected ? 'connected' : ''}`}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? 'Connecting...' : isConnected ? `Connected: ${formatAddress(address)}` : 'Connect Wallet'}
      </button>
      
      {showConnectors && !isConnected && connectors.length > 0 && (
        <div className="connector-menu">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnectorClick(connector.id)}
              className="connector-button"
              disabled={!connector.ready}
            >
              {connector.name}
            </button>
          ))}
          {error && (
            <div className="connector-error">
              {error.message}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

