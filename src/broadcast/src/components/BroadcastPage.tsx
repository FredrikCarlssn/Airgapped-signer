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
  nonce: number
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  gasPrice?: string
}

interface SignedTransactionData {
  transaction: TransactionObject
  serializedTransaction: string
  signature: string
  hash: string
}

// Broadcast status types
type BroadcastStatus = 'idle' | 'pending' | 'success' | 'error'

// Define a union type for provider
type Provider = ethers.BrowserProvider | ethers.JsonRpcProvider

const BroadcastPage = () => {
  const { txData } = useParams<{ txData: string }>()
  const [transactionData, setTransactionData] = useState<SignedTransactionData | null>(null)
  const [broadcastStatus, setBroadcastStatus] = useState<BroadcastStatus>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [provider, setProvider] = useState<Provider | null>(null)

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
              chainId: 11155111,
              data: '0x',
              nonce: 0,
            },
            serializedTransaction: '0xdemo_signature_for_testing_purposes_only',
            signature: '0xdemo_signature_for_testing_purposes_only',
            hash: '0xdemo_signature_for_testing_purposes_only'
          }
          setTransactionData(demoData)
          return
        }
        
        // Real data should be base64 or URL encoded
        const decodedData = decodeURIComponent(txData)
        const parsedData: SignedTransactionData = JSON.parse(decodedData)
        
        if (!parsedData.transaction || !parsedData.serializedTransaction || !parsedData.signature || !parsedData.hash) {
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
          const jsonRpcProvider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/1MzR_wTi7SDvz0ylPl_sCtxaWBC-DAv4')
          setProvider(jsonRpcProvider) 
      } catch (error) {
        console.error('Failed to initialize provider:', error)
      }
    }
    
    initProvider()
  }, [])
  
  // Verify signature (now handling EIP-712 typed data signature)
  const verifySignature = async (): Promise<boolean> => {
    if (!transactionData || !provider) return false
    
    try {
      // Extract the signature components (r, s, v)
      // EIP-712 signatures follow the same format as standard Ethereum signatures
      const signature = transactionData.signature;
      
      // We need to get the address that signed the message
      // We can recover it from the signature and the original hash
      const signerAddress = ethers.recoverAddress(
        transactionData.hash,
        signature
      );
      
      // Verify the recovered address matches the from address in the transaction
      if (signerAddress.toLowerCase() !== transactionData.transaction.from.toLowerCase()) {
        console.error('Signature validation failed: signer does not match sender');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
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
      
      try {
        // The serializedTransaction should be a complete RLP-encoded transaction
        const rawTransaction = transactionData.serializedTransaction;
        
        // Make sure it starts with 0x
        const prefixedRawTx = rawTransaction.startsWith('0x') ? rawTransaction : `0x${rawTransaction}`;
        
        console.log("Broadcasting serialized transaction:", prefixedRawTx);
        
        // For EIP-712 signed transactions, we need to create the final transaction
        // by combining the serialized transaction with the signature
        // Extract r, s, v from the signature
        const signature = transactionData.signature.slice(2); // Remove '0x'
        const r = '0x' + signature.slice(0, 64);
        const s = '0x' + signature.slice(64, 128);
        let v = parseInt(signature.slice(128, 130), 16);
        
        // Adjust v based on EIP-155 (v = chain_id * 2 + 35 or chain_id * 2 + 36)
        const chainId = transactionData.transaction.chainId;
        if (v === 0 || v === 1) {
          v = v + 27;
        }
        
        // Create a full serialized transaction that includes the signature
        const signedTx = ethers.concat([
          prefixedRawTx,
          r, s, '0x' + v.toString(16)
        ]);
        
        // Send the transaction to the network
        const tx = await provider.broadcastTransaction(signedTx);
        
        setTxHash(tx.hash);
        setBroadcastStatus('success');
      } catch (error: any) {
        throw new Error(`Failed to broadcast transaction: ${error.message}`);
      }
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
          
          <TransactionDetails 
            transaction={transactionData.transaction} 
            signature={transactionData.signature}
            hash={transactionData.hash}
          />
          
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