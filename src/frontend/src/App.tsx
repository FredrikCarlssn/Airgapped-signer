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
    chainId: '1', // Default to Ethereum mainnet
  });

  // State for wallet connection and transaction
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [serializedSignedTx, setSerializedSignedTx] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Broadcaster URL - in a real app, this would be configurable
  const [broadcasterUrl, setBroadcasterUrl] = useState('https://fredrikcarlssn.github.io/Airgapped-signer/#/');

  // Check if MetaMask is available
  useEffect(() => {
    const checkMetaMask = async () => {
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
        setErrorMessage("MetaMask is not installed. Please install MetaMask to use this application.");
      }
    };

    checkMetaMask();
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

      // Get chain ID to update the default
      const network = await provider.getNetwork();
      setTxParams(prev => ({ ...prev, chainId: network.chainId.toString() }));

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

      // Create a transaction object
      const txObject: TransactionObject = {
        from: account,
        to: txParams.to,
        value: ethers.parseEther(txParams.value || '0').toString(),
        gasLimit: BigInt(txParams.gasLimit || '21000').toString(),
        chainId: parseInt(txParams.chainId),
        data: txParams.data || '0x',
      };
      
      // Add gas pricing based on EIP-1559
      if (txParams.maxFeePerGas && txParams.maxPriorityFeePerGas) {
        txObject.maxFeePerGas = ethers.parseUnits(txParams.maxFeePerGas, 'gwei').toString();
        txObject.maxPriorityFeePerGas = ethers.parseUnits(txParams.maxPriorityFeePerGas, 'gwei').toString();
      }

      // Serialize the transaction to JSON
      const txJson = JSON.stringify(txObject);
      
      // Sign the transaction details as a message
      const signature = await window.ethereum!.request({
        method: 'personal_sign',
        params: [txJson, account]
      });
      
      // Create the complete signed transaction object that includes both 
      // the transaction details and the signature
      const completeSignedTx = JSON.stringify({
        transaction: txObject,
        signature: signature
      });
      
      // Create a URL with the transaction data
      const encodedTxData = encodeURIComponent(completeSignedTx);
      const qrCodeData = `${broadcasterUrl}${encodedTxData}`;
      
      // Set the serialized signed transaction with all the necessary information 
      // for the online device to reconstruct and broadcast it
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
      chainId: '1',
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
            value={txParams.chainId}
            onChange={handleInputChange}
          />
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
