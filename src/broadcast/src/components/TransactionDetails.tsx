import { ethers } from 'ethers'

interface TransactionObject {
  from: string
  to: string
  value: string
  gasLimit: string
  chainId: number
  data: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  gasPrice?: string
}

interface TransactionDetailsProps {
  transaction: TransactionObject
  signature?: string
  hash?: string
}

const TransactionDetails = ({ transaction, signature, hash }: TransactionDetailsProps) => {
  // Format value in ETH
  const formatValue = () => {
    try {
      // Convert value from Wei to ETH for display
      return `${ethers.formatEther(BigInt(transaction.value))} ETH`
    } catch (error) {
      return `${transaction.value} (Unable to format)`
    }
  }

  // Get network name from chainId
  const getNetworkName = (chainId: number) => {
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten Testnet',
      4: 'Rinkeby Testnet',
      5: 'Goerli Testnet',
      42: 'Kovan Testnet',
      56: 'Binance Smart Chain',
      137: 'Polygon Mainnet',
      80001: 'Mumbai Testnet',
      42161: 'Arbitrum One',
      10: 'Optimism',
      250: 'Fantom Opera',
      43114: 'Avalanche C-Chain',
    }
    
    return networks[chainId] || `Chain ID: ${chainId}`
  }

  // Format a hash or signature for display (truncate in the middle)
  const formatHash = (hash: string) => {
    if (!hash) return '';
    
    const prefix = hash.slice(0, 10);
    const suffix = hash.slice(-8);
    return `${prefix}...${suffix}`;
  }

  return (
    <div className="transaction-details">
      <h2>Transaction Details</h2>
      
      <div className="detail-group">
        <span className="detail-label">Network:</span>
        <div className="detail-value">{getNetworkName(transaction.chainId)}</div>
      </div>
      
      <div className="detail-group">
        <span className="detail-label">From:</span>
        <div className="detail-value">{transaction.from}</div>
      </div>
      
      <div className="detail-group">
        <span className="detail-label">To:</span>
        <div className="detail-value">{transaction.to}</div>
      </div>
      
      <div className="detail-group">
        <span className="detail-label">Value:</span>
        <div className="detail-value">{formatValue()}</div>
      </div>
      
      <div className="detail-group">
        <span className="detail-label">Gas Limit:</span>
        <div className="detail-value">{transaction.gasLimit}</div>
      </div>
      
      {transaction.maxFeePerGas && (
        <div className="detail-group">
          <span className="detail-label">Max Fee Per Gas:</span>
          <div className="detail-value">
            {ethers.formatUnits(BigInt(transaction.maxFeePerGas), 'gwei')} Gwei
          </div>
        </div>
      )}
      
      {transaction.maxPriorityFeePerGas && (
        <div className="detail-group">
          <span className="detail-label">Max Priority Fee Per Gas:</span>
          <div className="detail-value">
            {ethers.formatUnits(BigInt(transaction.maxPriorityFeePerGas), 'gwei')} Gwei
          </div>
        </div>
      )}
      
      {hash && (
        <div className="detail-group">
          <span className="detail-label">Transaction Hash:</span>
          <div className="detail-value hash-value">
            <span title={hash}>{formatHash(hash)}</span>
          </div>
        </div>
      )}
      
      {signature && (
        <div className="detail-group">
          <span className="detail-label">Signature:</span>
          <div className="detail-value hash-value">
            <span title={signature}>{formatHash(signature)}</span>
          </div>
        </div>
      )}
      
      {transaction.data && transaction.data !== '0x' && (
        <div className="detail-group">
          <span className="detail-label">Data:</span>
          <div className="detail-value">{transaction.data}</div>
        </div>
      )}
    </div>
  )
}

export default TransactionDetails 