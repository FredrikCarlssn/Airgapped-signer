import { formatEther, formatGwei } from 'viem'
import { 
  TransactionObject,
  getChainNativeSymbol,
  getChainName,
  getChainExplorerUrl,
  formatTransactionHash
} from '../types/transaction'

interface TransactionDetailsProps {
  transaction: TransactionObject
  hash?: string
}

const TransactionDetails = ({ transaction, hash }: TransactionDetailsProps) => {
  // Format value in ETH
  const formatValue = () => {
    try {
      return `${formatEther(BigInt(transaction.value))} ${getChainNativeSymbol(transaction.chainId)}`
    } catch (error) {
      return `${transaction.value} (Unable to format)`
    }
  }

  return (
    <div className="transaction-details">
      <h2>Transaction Details</h2>
      
      <div className="detail-group">
        <span className="detail-label">Network:</span>
        <div className="detail-value">{getChainName(transaction.chainId)}</div>
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
            {formatGwei(BigInt(transaction.maxFeePerGas))} Gwei
          </div>
        </div>
      )}
      
      {transaction.maxPriorityFeePerGas && (
        <div className="detail-group">
          <span className="detail-label">Max Priority Fee Per Gas:</span>
          <div className="detail-value">
            {formatGwei(BigInt(transaction.maxPriorityFeePerGas))} Gwei
          </div>
        </div>
      )}
      
      {hash && (
        <div className="detail-group">
          <span className="detail-label">Transaction Hash:</span>
          <div className="detail-value hash-value">
            <span title={hash}>
              {formatTransactionHash(hash)}
              {getChainExplorerUrl(transaction.chainId, hash) && (
                <a 
                  href={getChainExplorerUrl(transaction.chainId, hash)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  View on Explorer
                </a>
              )}
            </span>
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