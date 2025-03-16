import { 
  SUPPORTED_CHAINS, 
  getChainById, 
  getChainName, 
  getChainNativeSymbol, 
  getChainExplorerUrl 
} from 'shared/types/chains'

export interface TransactionObject {
  from: string
  to: string
  value: string
  gasLimit: string
  chainId: string
  data: string
  nonce?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  gasPrice?: string
}

export interface SignedTransactionData {
  transaction: TransactionObject
  serializedTransaction: string
}

// Broadcast status types
export type BroadcastStatus = 'idle' | 'pending' | 'success' | 'error'

// Format a hash for display (truncate in the middle)
export const formatTransactionHash = (hash: string): string => {
  if (!hash) return '';
  const prefix = hash.slice(0, 10);
  const suffix = hash.slice(-8);
  return `${prefix}...${suffix}`;
}

// Re-export chain functions
export { 
  SUPPORTED_CHAINS, 
  getChainById, 
  getChainName, 
  getChainNativeSymbol, 
  getChainExplorerUrl 
} 