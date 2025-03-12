import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="card">
      <h1>Transaction Broadcaster</h1>
      <p>This service allows you to broadcast signed transactions created on an offline device.</p>
      
      <div className="status pending">
        <h3>How to Use:</h3>
        <ol>
          <li>Create and sign a transaction on your offline device</li>
          <li>Scan the generated QR code with your online device</li>
          <li>The URL will automatically load with your transaction data</li>
          <li>Review the transaction details and click "Broadcast" to send it to the network</li>
        </ol>
      </div>
      
      <div className="status success">
        <h3>Security Benefits:</h3>
        <ul>
          <li>Your private keys never touch an internet-connected device</li>
          <li>The offline device creates and signs transactions securely</li>
          <li>This online interface only broadcasts the already-signed transaction</li>
          <li>Reduces risk of malware stealing your private keys</li>
        </ul>
      </div>
      
      <p>
        If you have a signed transaction in text format, you can paste it directly into the URL:
        <br />
        <code>www.yoursite.com/YOUR_SIGNED_TX_DATA_HERE</code>
      </p>
      
      <p>
        <Link to="/demo">
          <button className="btn btn-primary">View Demo Transaction</button>
        </Link>
      </p>
    </div>
  )
}

export default HomePage 