import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ethers } from 'ethers'
import TransactionDetails from './TransactionDetails'

// Define types for our transaction data
interface TransactionObject {
  from: string
  to: string
  value: string
  gasLimit: string
  chainId: number
  data: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}

interface SignedTransactionData {
  transaction: TransactionObject
  signature: string
}

// Broadcast status types
type BroadcastStatus = 'idle' | 'pending' | 'success' | 'error'

const BroadcastPage = () => {
  const { txData } = useParams<{ txData: string }>()
  const [transactionData, setTransactionData] = useState<SignedTransactionData | null>(null)
  const [broadcastStatus, setBroadcastStatus] = useState<BroadcastStatus>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)

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
              value: ethers.parseEther('0.1').toString(),
              gasLimit: '21000',
              chainId: 1,
              data: '0x',
            },
            signature: '0xdemo_signature_for_testing_purposes_only'
          }
          setTransactionData(demoData)
          return
        }
        
        // Real data should be base64 or URL encoded
        const decodedData = decodeURIComponent(txData)
        const parsedData: SignedTransactionData = JSON.parse(decodedData)
        
        if (!parsedData.transaction || !parsedData.signature) {
          throw new Error('Invalid transaction data format')
        }
        
        setTransactionData(parsedData)
      } catch (error: any) {
        setErrorMessage(`Failed to parse transaction data: ${error.message}`)
      }
    }
    
    parseTransactionData()
  }, [txData])
  
  // Initialize Ethereum provider
  useEffect(() => {
    const initProvider = async () => {
      try {
        // Check if window.ethereum exists (MetaMask or other wallet)
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum)
          setProvider(provider)
        } else {
          // Fallback to a public provider
          const provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/demo')
          setProvider(provider)
        }
      } catch (error) {
        console.error('Failed to initialize provider:', error)
      }
    }
    
    initProvider()
  }, [])
  
  // Verify signature (in a real app, you'd want more robust verification)
  const verifySignature = async (): Promise<boolean> => {
    if (!transactionData) return false
    
    try {
      // In a production app, you'd verify the signature against the transaction data
      // For demo, we'll just return true
      return true
    } catch (error) {
      console.error('Signature verification failed:', error)
      return false
    }
  }
  
  // Broadcast the transaction
  const broadcastTransaction = async () => {
    if (!transactionData || !provider) return
    
    setBroadcastStatus('pending')
    
    try {
      // Verify signature first
      const isValid = await verifySignature()
      if (!isValid) {
        throw new Error('Invalid signature')
      }
      
      // Prepare transaction for broadcast
      const tx = {
        to: transactionData.transaction.to,
        value: BigInt(transactionData.transaction.value),
        gasLimit: BigInt(transactionData.transaction.gasLimit),
        data: transactionData.transaction.data,
        chainId: transactionData.transaction.chainId,
      } as any
      
      // Add EIP-1559 parameters if they exist
      if (transactionData.transaction.maxFeePerGas) {
        tx.maxFeePerGas = BigInt(transactionData.transaction.maxFeePerGas)
      }
      if (transactionData.transaction.maxPriorityFeePerGas) {
        tx.maxPriorityFeePerGas = BigInt(transactionData.transaction.maxPriorityFeePerGas)
      }
      
      // In a real implementation, you'd recover the signed transaction
      // For demo, we're just doing a sendTransaction
      const response = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
      })
      
      setTxHash(response)
      setBroadcastStatus('success')
    } catch (error: any) {
      console.error('Transaction broadcast failed:', error)
      setErrorMessage(error.message)
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
            <p>Please wait while your transaction is being sent to the Ethereum network.</p>
          </div>
        )
      case 'success':
        return (
          <div className="status success">
            <h3>Transaction Broadcast Successful!</h3>
            <p>Your transaction has been successfully broadcast to the Ethereum network.</p>
            {txHash && (
              <p>
                Transaction Hash: <span className="tx-hash">{txHash}</span>
                <br />
                <a 
                  href={`https://etherscan.io/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ marginTop: '1rem' }}
                >
                  View on Etherscan
                </a>
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
          
          <TransactionDetails transaction={transactionData.transaction} />
          
          {broadcastStatus === 'idle' && (
            <button 
              className="btn btn-primary" 
              onClick={broadcastTransaction}
              disabled={!provider}
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