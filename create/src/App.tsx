import { useState, ChangeEvent } from 'react';
import './App.css';
import { QRCodeSVG } from 'qrcode.react';
import { ethers } from 'ethers';
import ChainSelector from './components/ChainSelector';
import { MINIMAL_CHAINS } from '@shared/types/chains';

// @DEV: This is a development version of the app.
interface TransactionObject {
  from: string;
  to: string;
  value: string;
  gasLimit: string;
  chainId: string;
  data: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  nonce: string;
}

const INITIAL_TRANSACTION_OBJECT: TransactionObject = {
  from: '',
  to: '',
  value: '',
  gasLimit: '21000',
  maxFeePerGas: '',
  maxPriorityFeePerGas: '',
  data: '',
  chainId: MINIMAL_CHAINS[0].id.toString(), // Default to first chain (usually Ethereum mainnet)
  nonce: '',
}

function App() {
  // State for transaction parameters
  const [txParams, setTxParams] = useState<TransactionObject>(INITIAL_TRANSACTION_OBJECT);

  // State for wallet connection and transaction
  const [keystoreWallet, setKeystoreWallet] = useState<ethers.Wallet | ethers.HDNodeWallet | null>(null);
  const [serializedSignedTx, setSerializedSignedTx] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Broadcaster URL
  const [broadcasterUrl, setBroadcasterUrl] = useState('https://fredrikcarlssn.github.io/Airgapped-signer/#/');

  // Keystore state
  const [keystoreContent, setKeystoreContent] = useState<string | null>(null);
  const [keystorePassword, setKeystorePassword] = useState('');

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTxParams(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle chain selection
  const handleChainChange = (chainId: number) => {
    setTxParams(prev => ({ ...prev, chainId: chainId.toString() }));
  };
  
  // Handle broadcaster URL change
  const handleBroadcasterUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBroadcasterUrl(e.target.value);
  };

  // Handle keystore file upload
  const handleKeystoreFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setKeystoreContent(event.target.result);
        }
      };
      
      reader.readAsText(file);
    }
  };

  // Handle keystore password change
  const handleKeystorePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeystorePassword(e.target.value);
  };

  // Load wallet from keystore
  const loadKeystoreWallet = async () => {
    try {
      if (!keystoreContent) {
        throw new Error("Please upload a keystore file");
      }
      
      if (!keystorePassword) {
        throw new Error("Please enter the keystore password");
      }
      
      // Decrypt keystore and create wallet
      const wallet = await ethers.Wallet.fromEncryptedJson(keystoreContent, keystorePassword);
      setKeystoreWallet(wallet);
      setErrorMessage('');
      
    } catch (error: any) {
      console.error("Error loading keystore:", error);
      setErrorMessage("Failed to load keystore: " + error.message);
    }
  };

  // Convert form state to TransactionObject
  const createTransactionObjectFromForm = (): TransactionObject | null => {
    if (!keystoreWallet || !txParams.nonce) {
      return null;
    }
    
    const txObject: TransactionObject = {
      from: keystoreWallet.address,
      to: txParams.to,
      value: txParams.value || '0',
      gasLimit: txParams.gasLimit || '21000',
      chainId: txParams.chainId,
      data: txParams.data || '0x',
      nonce: txParams.nonce,
    };
    
    // Add EIP-1559 parameters if provided
    if (txParams.maxFeePerGas && txParams.maxPriorityFeePerGas) {
      txObject.maxFeePerGas = txParams.maxFeePerGas;
      txObject.maxPriorityFeePerGas = txParams.maxPriorityFeePerGas;
    }
    
    return txObject;
  };

  // Reset form
  const resetForm = () => {
    setTxParams(INITIAL_TRANSACTION_OBJECT);
    setSerializedSignedTx('');
    setErrorMessage('');
  };

  // Create and sign transaction with keystore wallet
  const createAndSignTransaction = async () => {
    try {
      if (!keystoreWallet) {
        throw new Error("Load your keystore wallet first");
      }

      if (!txParams.nonce) {
        throw new Error("Please enter a nonce value");
      }

      // Convert form state to TransactionObject
      const txObject = createTransactionObjectFromForm();
      
      if (!txObject) {
        throw new Error("Failed to create transaction object");
      }

      // Convert to ethers.TransactionRequest for signing
      const tx: ethers.TransactionRequest = {
        to: ethers.getAddress(txObject.to),
        nonce: parseInt(txObject.nonce), 
        chainId: parseInt(txObject.chainId),
        data: txObject.data,
        gasLimit: ethers.parseUnits(txObject.gasLimit, 0), // Convert to bigint
        value: txObject.value ? ethers.parseEther(txObject.value) : 0n, // Parse value as ETH
      };
      
      // Handle gas pricing - use gasPrice if maxFeePerGas is not provided
      if (txObject.maxFeePerGas && txObject.maxPriorityFeePerGas) {
        // Convert Gwei to Wei for EIP-1559 parameters
        tx.maxFeePerGas = ethers.parseUnits(txObject.maxFeePerGas, 'gwei');
        tx.maxPriorityFeePerGas = ethers.parseUnits(txObject.maxPriorityFeePerGas, 'gwei');
      } else {
        // Default gasPrice if EIP-1559 params are not provided
        tx.gasPrice = ethers.parseUnits('10', 'gwei');
      }

      try {
        // Sign the transaction with the keystore wallet
        const signedTx = await keystoreWallet.signTransaction(tx);
        
        // Create the complete signed transaction object with serializable values
        const completeSignedTx = JSON.stringify({
          transaction: txObject, // Use our TransactionObject for serialization
          serializedTransaction: signedTx,
        });
        
        // Create a URL with the transaction data
        const encodedTxData = encodeURIComponent(completeSignedTx);
        const qrCodeData = `${broadcasterUrl}${encodedTxData}`;
        
        // Set the serialized signed transaction
        setSerializedSignedTx(qrCodeData);
        setErrorMessage('');
      } catch (error: any) {
        throw new Error(`Failed to sign transaction: ${error.message}`);
      }
    } catch (error: any) {
      console.error("Error creating or signing transaction:", error);
      setErrorMessage("Failed to create or sign transaction: " + error.message);
    }
  };

  return (
    <div className="app-container">
      <h1>Airgapped Transaction Signer</h1>
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      {/* Keystore Section */}
      <div className="keystore-section">
        <h2>Load Keystore File</h2>
        <div className="form-group">
          <label htmlFor="keystoreFile">Keystore File:</label>
          <input
            type="file"
            id="keystoreFile"
            onChange={handleKeystoreFileUpload}
            accept=".json"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={keystorePassword}
            onChange={handleKeystorePasswordChange}
            placeholder="Enter your keystore password"
          />
        </div>
        <button 
          onClick={loadKeystoreWallet} 
          disabled={!keystoreContent || !keystorePassword}
          className="connect-button"
        >
          Load Keystore Wallet
        </button>
        
        {keystoreWallet && (
          <div className="wallet-info">
            <p>Keystore Loaded: {keystoreWallet.address.substring(0, 6)}...{keystoreWallet.address.substring(keystoreWallet.address.length - 4)}</p>
          </div>
        )}
      </div>

      {/* Transaction Form */}
      <div className="transaction-form">
        <h2>Create Transaction</h2>
        
        {/* Chain Selector */}
        <ChainSelector
          selectedChainId={parseInt(txParams.chainId)}
          onChange={handleChainChange}
          className="form-group"
        />
        
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
          <label htmlFor="value">Value (in ETH):</label>
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
          <label htmlFor="nonce">Nonce:</label>
          <p>You can find a helper tool on the transaction broadcaster page</p>
          <input
            type="text"
            id="nonce"
            name="nonce"
            value={txParams.nonce}
            onChange={handleInputChange}
            placeholder="Enter nonce"
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
            placeholder="21000"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="maxFeePerGas">Max Fee Per Gas (Gwei):</label>
          <input
            type="text"
            id="maxFeePerGas"
            name="maxFeePerGas"
            value={txParams.maxFeePerGas}
            onChange={handleInputChange}
            placeholder="Optional - for EIP-1559 transactions"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="maxPriorityFeePerGas">Max Priority Fee Per Gas (Gwei):</label>
          <input
            type="text"
            id="maxPriorityFeePerGas"
            name="maxPriorityFeePerGas"
            value={txParams.maxPriorityFeePerGas}
            onChange={handleInputChange}
            placeholder="Optional - for EIP-1559 transactions"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="data">Data (hex):</label>
          <textarea
            id="data"
            name="data"
            value={txParams.data}
            onChange={handleInputChange}
            placeholder="0x (optional)"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="broadcasterUrl">Broadcaster URL:</label>
          <input
            type="text"
            id="broadcasterUrl"
            disabled
            value={broadcasterUrl}
            onChange={handleBroadcasterUrlChange}
            placeholder="Enter broadcaster URL"
          />
        </div>
        
        <div className="button-group">
          <button 
            onClick={createAndSignTransaction}
            disabled={!keystoreWallet}
            className="sign-button"
          >
            Sign Transaction
          </button>
          <button 
            onClick={resetForm}
            className="reset-button"
          >
            Reset Form
          </button>
        </div>
      </div>

      {/* QR Code Display */}
      {serializedSignedTx && (
        <div className="qr-section">
          <h2>Signed Transaction QR Code</h2>
          <div className="qr-container">
            <QRCodeSVG 
              value={serializedSignedTx}
              size={256}
              level="H"
            />
          </div>
          <p className="qr-instructions">
            Scan this QR code with your online device to broadcast the transaction
          </p>
          <p className="qr-instructions">
            <a href={serializedSignedTx} target="_blank" rel="noopener noreferrer">
              Open in browser
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
