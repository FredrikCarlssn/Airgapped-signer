import { MINIMAL_CHAINS } from '@shared/types/chains'
import type { MinimalChainInfo } from '@shared/types/chains'

interface ChainSelectorProps {
  selectedChainId: number
  onChange: (chainId: number) => void
  className?: string
}

export const ChainSelector = ({ selectedChainId, onChange, className = '' }: ChainSelectorProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const chainId = parseInt(event.target.value)
    onChange(chainId)
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Network
      </label>
      <select
        value={selectedChainId}
        onChange={handleChange}
        className="w-full p-2 border rounded bg-white"
      >
        {MINIMAL_CHAINS.map((chain: MinimalChainInfo) => (
          <option key={chain.id} value={chain.id}>
            {chain.name} ({chain.nativeCurrency.symbol})
          </option>
        ))}
      </select>
    </div>
  )
}

export default ChainSelector 