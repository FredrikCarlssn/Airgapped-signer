import { useState, useEffect, ChangeEvent } from 'react';
import './App.css';

// Import necessary components and libraries
import QRCode from 'qrcode.react';
import { ethers } from 'ethers';

// Define transaction object type
interface TransactionObject {
  from: string;
  to: string;
  value: string;
  gasLimit: string;
  chainId: number;
  data: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  nonce: number;
}

function App() {
  // State for transaction parameters
  const [txParams, setTxParams] = useState({
    to: '',
    value: '',
    gasLimit: '21000',
    maxFeePerGas: '',
    maxPriorityFeePerGas: '',
    data: '',
    chainId: '11155111', // Default to Ethereum sepolia
    nonce: '',
  });

  // State for wallet connection and transaction
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [serializedSignedTx, setSerializedSignedTx] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Broadcaster URL - in a real app, this would be configurable
  const [broadcasterUrl, setBroadcasterUrl] = useState('https://fredrikcarlssn.github.io/Airgapped-signer/#/');

  // Check if wallet is available
  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        try {
          // We don't connect automatically - we'll wait for user to click connect
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
        } catch (error: any) {
          console.error("Error initializing provider:", error);
          setErrorMessage("Failed to initialize provider");
        }
      } else {
        setErrorMessage("Browser wallet is not installed. Please install a Browser wallet to use this application.");
      }
    };

    checkWallet();
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!provider) {
        throw new Error("Provider not initialized");
      }

      const accounts = await window.ethereum!.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setWalletConnected(true);
          await window.ethereum!.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xAA36A7' }],
          });

      // Clear any previous errors
      setErrorMessage('');
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      setErrorMessage("Failed to connect wallet: " + error.message);
    }
  };

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTxParams(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle broadcaster URL change
  const handleBroadcasterUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBroadcasterUrl(e.target.value);
  };

  // Create and sign transaction
  const createAndSignTransaction = async () => {
    try {
      if (!walletConnected) {
        throw new Error("Connect your wallet first");
      }

      if (!txParams.nonce) {
        throw new Error("Please enter a nonce value");
      }

      // Create a transaction object using toBeHex
      const tx = {
        nonce: ethers.toBeHex(parseInt(txParams.nonce)),
        gasLimit: ethers.toBeHex(BigInt(txParams.gasLimit || '21000')),
        to: txParams.to,
        value: ethers.toBeHex(ethers.parseEther(txParams.value || '0')),
        chainId: parseInt(txParams.chainId),
        data: txParams.data || '0x',
      } as any;
      
      // Handle gas pricing - use gasPrice if maxFeePerGas is not provided
      if (txParams.maxFeePerGas && txParams.maxPriorityFeePerGas) {
        tx.maxFeePerGas = ethers.toBeHex(ethers.parseUnits(txParams.maxFeePerGas, 'gwei'));
        tx.maxPriorityFeePerGas = ethers.toBeHex(ethers.parseUnits(txParams.maxPriorityFeePerGas, 'gwei'));
      } else {
        // Default gasPrice if EIP-1559 params are not provided
        tx.gasPrice = ethers.toBeHex(ethers.parseUnits('10', 'gwei'));
      }

      // RLP encode the transaction parameters
      const serializedTx = ethers.encodeRlp([
        tx.nonce, 
        tx.gasPrice || '0x', 
        tx.gasLimit, 
        tx.to, 
        tx.value, 
        tx.data || '0x',
        // For EIP-155 replay protection
        ethers.toBeHex(tx.chainId),
        '0x',
        '0x'
      ]);

      // Hash the serialized transaction
      const txHash = ethers.keccak256(serializedTx);

      // Create an EIP-712 typed data structure for the transaction
      const typedData = {
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
          ],
          Transaction: [
            { name: 'nonce', type: 'uint256' },
            { name: 'gasLimit', type: 'uint256' },
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'data', type: 'bytes' },
            { name: 'chainId', type: 'uint256' },
          ]
        },
        primaryType: 'Transaction',
        domain: {
          name: 'Airgapped Signer',
          version: '1',
          chainId: parseInt(txParams.chainId),
        },
        message: {
          nonce: parseInt(txParams.nonce),
          gasLimit: BigInt(txParams.gasLimit || '21000'),
          to: txParams.to,
          value: ethers.parseEther(txParams.value || '0'),
          data: txParams.data || '0x',
          chainId: parseInt(txParams.chainId),
        } as any // Using any to allow dynamic property addition
      };

      // Add gas pricing to the typed data message if needed
      if (tx.gasPrice) {
        typedData.types.Transaction.push({ name: 'gasPrice', type: 'uint256' });
        typedData.message.gasPrice = ethers.parseUnits('10', 'gwei');
      } else if (tx.maxFeePerGas && tx.maxPriorityFeePerGas) {
        typedData.types.Transaction.push({ name: 'maxFeePerGas', type: 'uint256' });
        typedData.types.Transaction.push({ name: 'maxPriorityFeePerGas', type: 'uint256' });
        typedData.message.maxFeePerGas = ethers.parseUnits(txParams.maxFeePerGas!, 'gwei');
        typedData.message.maxPriorityFeePerGas = ethers.parseUnits(txParams.maxPriorityFeePerGas!, 'gwei');
      }

      // Convert BigInt values in the typed data to strings to make them JSON-serializable
      const typedDataForJson = {
        ...typedData,
        message: {
          ...typedData.message,
          // Convert all potential BigInt values to strings
          gasLimit: typedData.message.gasLimit.toString(),
          value: typedData.message.value.toString(),
        }
      };
      
      // If there are gas price values, convert them to strings too
      if ('gasPrice' in typedData.message) {
        typedDataForJson.message.gasPrice = typedData.message.gasPrice.toString();
      }
      if ('maxFeePerGas' in typedData.message) {
        typedDataForJson.message.maxFeePerGas = typedData.message.maxFeePerGas.toString();
      }
      if ('maxPriorityFeePerGas' in typedData.message) {
        typedDataForJson.message.maxPriorityFeePerGas = typedData.message.maxPriorityFeePerGas.toString();
      }
      
      // Request signature using eth_signTypedData_v4
      const signature = await window.ethereum!.request({
        method: "eth_signTypedData_v4",
        params: [account, JSON.stringify(typedDataForJson)]
      });
      
      // tx is already using toBeHex for all values, which makes it serializable
      // but double-check there are no BigInt values left in the transaction object
      
      // Create the complete signed transaction object with serializable values
      const completeSignedTx = JSON.stringify({
        transaction: tx,
        serializedTransaction: serializedTx,
        signature: signature,
        hash: txHash
      });
      
      // Create a URL with the transaction data
      const encodedTxData = encodeURIComponent(completeSignedTx);
      const qrCodeData = `${broadcasterUrl}${encodedTxData}`;
      
      // Set the serialized signed transaction
      setSerializedSignedTx(qrCodeData);
      setErrorMessage('');
    } catch (error: any) {
      console.error("Error creating or signing transaction:", error);
      setErrorMessage("Failed to create or sign transaction: " + error.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setTxParams({
      to: '',
      value: '',
      gasLimit: '21000',
      maxFeePerGas: '',
      maxPriorityFeePerGas: '',
      data: '',
      chainId: '11155111',
      nonce: '',
    });
    setSerializedSignedTx('');
    setErrorMessage('');
  };

  return (
    <div className="app-container">
      <h1>Offline Transaction Signer</h1>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      {/* Wallet Connection Section */}
      <div className="wallet-section">
        {!walletConnected ? (
          <button onClick={connectWallet} className="connect-button">
            Connect Wallet
          </button>
        ) : (
          <div className="wallet-info">
            <p>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
          </div>
        )}
      </div>

      {/* Transaction Form */}
      <div className="transaction-form">
        <h2>Create Transaction</h2>
        
        <div className="form-group">
          <label htmlFor="to">Recipient Address:</label>
          <input
            type="text"
            id="to"
            name="to"
            value={txParams.to}
            onChange={handleInputChange}
            placeholder="0x..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="value">Amount (ETH):</label>
          <input
            type="text"
            id="value"
            name="value"
            value={txParams.value}
            onChange={handleInputChange}
            placeholder="0.0"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="gasLimit">Gas Limit:</label>
          <input
            type="text"
            id="gasLimit"
            name="gasLimit"
            value={txParams.gasLimit}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="maxFeePerGas">Max Fee (Gwei):</label>
          <input
            type="text"
            id="maxFeePerGas"
            name="maxFeePerGas"
            value={txParams.maxFeePerGas}
            onChange={handleInputChange}
            placeholder="Optional"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="maxPriorityFeePerGas">Max Priority Fee (Gwei):</label>
          <input
            type="text"
            id="maxPriorityFeePerGas"
            name="maxPriorityFeePerGas"
            value={txParams.maxPriorityFeePerGas}
            onChange={handleInputChange}
            placeholder="Optional"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="data">Data (hex):</label>
          <textarea
            id="data"
            name="data"
            value={txParams.data}
            onChange={handleInputChange}
            placeholder="0x (Optional)"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="chainId">Chain ID:</label>
          <input
            type="text"
            id="chainId"
            name="chainId"
            disabled
            value={txParams.chainId}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="nonce">Nonce:</label>
          <input
            type="text"
            id="nonce"
            name="nonce"
            value={txParams.nonce}
            onChange={handleInputChange}
            placeholder="Transaction count (nonce)"
          />
          <small className="form-hint">Enter the account's current transaction count (nonce)</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="broadcasterUrl">Broadcaster URL:</label>
          <input
            type="text"
            id="broadcasterUrl"
            name="broadcasterUrl"
            value={broadcasterUrl}
            onChange={handleBroadcasterUrlChange}
            placeholder="https://YOUR_GITHUB_USERNAME.github.io/Airgapped-signer/#/"
          />
          <small className="form-hint">URL of the online broadcaster service</small>
        </div>
        
        <div className="form-actions">
          <button 
            onClick={createAndSignTransaction} 
            disabled={!walletConnected || !txParams.to}
            className="sign-button"
          >
            Create & Sign Transaction
          </button>
          <button onClick={resetForm} className="reset-button">
            Reset Form
          </button>
        </div>
      </div>

      {/* QR Code Display */}
      {serializedSignedTx && (
        <div className="qr-code-section">
          <h2>Scan this QR code with your online device</h2>
          <div className="qr-code">
            <QRCode value={serializedSignedTx} size={256} level="H" />
          </div>
          <div className="transaction-details">
            <h3>Instructions:</h3>
            <ol className="instructions-list">
              <li>Scan this QR code with an online device</li>
              <li>The online device will open a web page with your transaction details</li>
              <li>Review the transaction details on the online device</li>
              <li>Click "Broadcast Transaction" to send it to the blockchain</li>
            </ol>
            <h3>QR Code Data (URL):</h3>
            <div className="serialized-tx">
              {serializedSignedTx}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
