import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  createPublicClient, 
  http,
  parseEther,
  PublicClient,
} from 'viem'
import { 
  SignedTransactionData,
  BroadcastStatus,
  getChainById,
  getChainExplorerUrl
} from '../types/transaction'
import TransactionDetails from './TransactionDetails'

const BroadcastPage = () => {
  const { txData } = useParams<{ txData: string }>()
  const [transactionData, setTransactionData] = useState<SignedTransactionData | null>(null)
  const [broadcastStatus, setBroadcastStatus] = useState<BroadcastStatus>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [client, setClient] = useState<PublicClient | null>(null)

  // Parse transaction data from URL
  useEffect(() => {
    const parseTransactionData = () => {
      if (!txData) return
      
      try {
        // For demo purposes
        if (txData === 'demo') {
          const demoData: SignedTransactionData = {
            transaction: {
              from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
              to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
              value: parseEther('0.1').toString(),
              gasLimit: '21000',
              chainId: '11155111', // Sepolia
              data: '0x',
              nonce: '0',
            },
            serializedTransaction: '0xdemo_serialized_tx_for_testing_purposes_only'
          }
          setTransactionData(demoData)
          return
        }
        
        // Real data should be URL encoded
        const decodedData = decodeURIComponent(txData)
        const parsedData: SignedTransactionData = JSON.parse(decodedData)
        
        if (!parsedData.transaction || !parsedData.serializedTransaction) {
          throw new Error('Invalid transaction data format')
        }
        
        setTransactionData(parsedData)
      } catch (error: any) {
        setErrorMessage(`Failed to parse transaction data: ${error.message}`)
      }
    }
    
    parseTransactionData()
  }, [txData])
  
  // Initialize client when transaction data is available
  useEffect(() => {
    const initClient = () => {
      if (!transactionData) return

      try {
        const chainId = parseInt(transactionData.transaction.chainId)
        const chain = getChainById(chainId)
        
        if (!chain) {
          throw new Error(`Unsupported chain ID: ${chainId}`)
        }

        const newClient = createPublicClient({
          chain: chain as any,
          transport: http()
        })

        setClient(newClient as any)
      } catch (error: any) {
        console.error('Failed to initialize client:', error)
        setErrorMessage(`Failed to initialize client: ${error.message}`)
      }
    }
    
    initClient()
  }, [transactionData])
  
  // Broadcast the transaction
  const broadcastTransaction = async () => {
    if (!transactionData || !client) return
    
    setBroadcastStatus('pending')
    setErrorMessage(null)
    
    try {
      // Get the serialized transaction
      const serializedTx = transactionData.serializedTransaction
      
      // Make sure it starts with 0x
      const prefixedTx = serializedTx.startsWith('0x') ? serializedTx : `0x${serializedTx}`
      
      console.log("Broadcasting serialized transaction:", prefixedTx)
      
      // Send the transaction to the network
      const hash = await client.sendRawTransaction({
        serializedTransaction: prefixedTx as `0x${string}`
      })
      
      setTxHash(hash)
      setBroadcastStatus('success')
    } catch (error: any) {
      console.error('Transaction broadcast failed:', error)
      setErrorMessage(`Failed to broadcast transaction: ${error.message}`)
      setBroadcastStatus('error')
    }
  }
  
  // Render appropriate status message
  const renderStatusMessage = () => {
    switch (broadcastStatus) {
      case 'pending':
        return (
          <div className="status pending">
            <h3>Broadcasting Transaction...</h3>
            <p>Please wait while your transaction is being sent to the network.</p>
          </div>
        )
      case 'success':
        return (
          <div className="status success">
            <h3>Transaction Broadcast Successful!</h3>
            <p>Your transaction has been successfully broadcast to the network.</p>
            {txHash && transactionData && (
              <p>
                Transaction Hash: <span className="tx-hash">{txHash}</span>
                <br />
                {getChainExplorerUrl(transactionData.transaction.chainId, txHash) && (
                  <a 
                    href={getChainExplorerUrl(transactionData.transaction.chainId, txHash)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                  >
                    View on Block Explorer
                  </a>
                )}
              </p>
            )}
          </div>
        )
      case 'error':
        return (
          <div className="status error">
            <h3>Transaction Broadcast Failed</h3>
            <p>{errorMessage || 'There was an error broadcasting your transaction. Please try again.'}</p>
          </div>
        )
      default:
        return null
    }
  }
  
  return (
    <div className="card">
      <h1>Transaction Broadcaster</h1>
      
      {errorMessage && broadcastStatus === 'idle' && (
        <div className="status error">
          <h3>Error</h3>
          <p>{errorMessage}</p>
          <Link to="/">
            <button className="btn btn-primary">Return Home</button>
          </Link>
        </div>
      )}
      
      {!errorMessage && transactionData && (
        <>
          {renderStatusMessage()}
          
          <TransactionDetails 
            transaction={transactionData.transaction} 
            hash={txHash || undefined}
          />
          
          {broadcastStatus === 'idle' && (
            <button 
              className="btn btn-primary" 
              onClick={broadcastTransaction}
              disabled={!client}
            >
              Broadcast Transaction
            </button>
          )}
          
          {broadcastStatus !== 'idle' && broadcastStatus !== 'pending' && (
            <Link to="/">
              <button className="btn btn-primary">Return Home</button>
            </Link>
          )}
        </>
      )}
    </div>
  )
}

export default BroadcastPage