import { Chain } from 'viem'
import { 
  mainnet,
  sepolia,
  polygon,
  arbitrum, 
  optimism,
  base,
  zkSync,
  avalanche,
  bsc,
  fantom,
  gnosis,
} from 'viem/chains'

// Define supported chains
export const SUPPORTED_CHAINS: Chain[] = [
  mainnet,
  sepolia,
  polygon,
  arbitrum,
  optimism,
  base,
  zkSync,
  avalanche,
  bsc,
  fantom,
  gnosis,
]

// Helper functions for chain operations
export const getChainById = (chainId: string | number): Chain | undefined => {
  const id = typeof chainId === 'string' ? parseInt(chainId) : chainId
  return SUPPORTED_CHAINS.find(c => c.id === id)
}

export const getChainNativeSymbol = (chainId: string | number): string => {
  const chain = getChainById(chainId)
  return chain?.nativeCurrency.symbol || 'ETH'
}

export const getChainName = (chainId: string | number): string => {
  const chain = getChainById(chainId)
  return chain?.name || `Chain ID: ${chainId}`
}

export const getChainExplorerUrl = (chainId: string | number, hash: string): string | null => {
  const chain = getChainById(chainId)
  return chain?.blockExplorers?.default.url ? `${chain.blockExplorers.default.url}/tx/${hash}` : null
}

// Get a minimal version of chain info suitable for offline storage
export interface MinimalChainInfo {
  id: number
  name: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

// Convert a Chain to MinimalChainInfo (strip out RPC URLs and other online-only data)
export const toMinimalChainInfo = (chain: Chain): MinimalChainInfo => {
  return {
    id: chain.id,
    name: chain.name,
    nativeCurrency: chain.nativeCurrency,
  }
}

// Get all chains in minimal format
export const MINIMAL_CHAINS: MinimalChainInfo[] = SUPPORTED_CHAINS.map(toMinimalChainInfo) 