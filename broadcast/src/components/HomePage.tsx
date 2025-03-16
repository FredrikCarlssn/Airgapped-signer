import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createPublicClient, http, formatGwei, parseGwei } from 'viem'
import { SUPPORTED_CHAINS } from '../types/transaction'

// Create an array of supported chains
const chains = SUPPORTED_CHAINS

const HomePage = () => {
  const [address, setAddress] = useState('')
  const [selectedChain, setSelectedChain] = useState<any>(chains[0])
  const [nonce, setNonce] = useState<number | null>(null)
  const [gasData, setGasData] = useState<{
    baseFee: string;
    priorityFee: string;
    totalFee: string;
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Create a public client for the selected chain
  const getPublicClient = (chain: any) => {
    return createPublicClient({
      chain: chain as any,
      transport: http()
    })
  }

  const checkNonce = async () => {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError('Please enter a valid address')
      return
    }
    
    setLoading(true)
    setError('')
    try {
      const client = getPublicClient(selectedChain)
      const nonceValue = await client.getTransactionCount({ address: address as `0x${string}` })
      setNonce(nonceValue)
    } catch (err) {
      setError(`Error fetching nonce: ${err instanceof Error ? err.message : 'Unknown error'}`)
      console.error('Nonce fetch error:', err)
    }
    setLoading(false)
  }

  const checkGasPrices = async () => {
    setLoading(true)
    setError('')
    try {
      const client = getPublicClient(selectedChain)
      const [gasPrice, block] = await Promise.all([
        client.getGasPrice(),
        client.getBlock({ blockTag: 'latest' })
      ])

      const baseFeePerGas = block.baseFeePerGas || gasPrice
      const priorityFeePerGas = parseGwei('1.5') // Default priority fee of 1.5 Gwei
      const totalFee = baseFeePerGas + priorityFeePerGas

      setGasData({
        baseFee: formatGwei(baseFeePerGas),
        priorityFee: formatGwei(priorityFeePerGas),
        totalFee: formatGwei(totalFee)
      })
    } catch (err) {
      setError(`Error fetching gas prices: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
    setLoading(false)
  }

  return (
    <div className="container">
      <div className="card mb-8">
        <h1>Transaction Broadcaster</h1>
        <p>This service allows you to broadcast signed transactions created on an offline device.</p>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">How to Use:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Create and sign a transaction on the airgapped signer software</li>
            <li>Scan the generated QR code with your online device</li>
            <li>The URL will automatically load with your transaction data</li>
            <li>Review the transaction details and click "Broadcast" to send it to the network</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">Note: The information displayed about the transaction is only for demo purposes. There is no functionality to verify the transaction on this website.</p>
        </div>
      </div>

      <h2 className="mb-6">Blockchain Tools</h2>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {/* Chain Selector */}
      <div className="select-container">
        <select
          value={selectedChain.name}
          onChange={(e) => {
            const chain = chains.find(c => c.name === e.target.value)
            if (chain) setSelectedChain(chain as any)
          }}
        >
          {chains.map((chain: any) => (
            <option key={chain.id} value={chain.name}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid-container">
        {/* Nonce Checker */}
        <div className="card">
          <h2>Check Address Nonce</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter address (0x...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 mr-8 border rounded"
            />
            <button
              onClick={checkNonce}
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Checking...' : 'Check Nonce'}
            </button>
            {nonce !== null && (
              <div className="result-container">
                <p>Current Nonce: {nonce}</p>
                <p className="text-sm text-gray-600">(Use this nonce for your next transaction)</p>
              </div>
            )}
          </div>
        </div>

        {/* Gas Price Checker */}
        <div className="card">
          <h2>Current Gas Prices on {selectedChain.name}</h2>
          <button
            onClick={checkGasPrices}
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Fetching...' : 'Check Gas Prices'}
          </button>
          {gasData && (
            <div className="result-container space-y-2">
              <p>Base Fee: {gasData.baseFee} Gwei</p>
              <p>Priority Fee (Tip): {gasData.priorityFee} Gwei</p>
              <p>Total Fee: {gasData.totalFee} Gwei</p>
              <p className="text-sm text-gray-600">Prices in {selectedChain.nativeCurrency.symbol}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Link to="/demo">
          <button className="btn btn-secondary">View Demo Transaction</button>
        </Link>
      </div>
    </div>
  )
}

export default HomePage 