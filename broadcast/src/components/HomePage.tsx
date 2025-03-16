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
    <div className="container mx-auto p-4">
      <div className="card mb-8 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Transaction Broadcaster</h1>
        <p className="mb-4">This service allows you to broadcast signed transactions created on an offline device.</p>
        
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

      <h2 className="text-2xl font-bold mb-6">Blockchain Tools</h2>
      
      {/* Chain Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Chain</label>
        <select
          value={selectedChain.name}
          onChange={(e) => {
            const chain = chains.find(c => c.name === e.target.value)
            if (chain) setSelectedChain(chain as any)
          }}
          className="w-full p-2 border rounded"
        >
          {chains.map((chain: any) => (
            <option key={chain.id} value={chain.name}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nonce Checker */}
        <div className="card p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Check Address Nonce</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter address (0x...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={checkNonce}
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Checking...' : 'Check Nonce'}
            </button>
            {nonce !== null && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <p>Current Nonce: {nonce}</p>
                <p className="text-sm text-gray-600">(Use this nonce for your next transaction)</p>
              </div>
            )}
          </div>
        </div>

        {/* Gas Price Checker */}
        <div className="card p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Current Gas Prices on {selectedChain.name}</h2>
          <button
            onClick={checkGasPrices}
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Fetching...' : 'Check Gas Prices'}
          </button>
          {gasData && (
            <div className="mt-4 p-3 bg-gray-100 rounded space-y-2">
              <p>Base Fee: {gasData.baseFee} Gwei</p>
              <p>Priority Fee (Tip): {gasData.priorityFee} Gwei</p>
              <p>Total Fee: {gasData.totalFee} Gwei</p>
              <p className="text-sm text-gray-600">Prices in {selectedChain.nativeCurrency.symbol}</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-6">
        <Link to="/demo">
          <button className="btn btn-secondary">View Demo Transaction</button>
        </Link>
      </div>
    </div>
  )
}

export default HomePage 