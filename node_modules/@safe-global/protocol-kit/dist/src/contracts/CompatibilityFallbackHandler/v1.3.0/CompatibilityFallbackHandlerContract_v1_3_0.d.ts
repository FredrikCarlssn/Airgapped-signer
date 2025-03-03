import CompatibilityFallbackHandlerBaseContract from '../../../contracts/CompatibilityFallbackHandler/CompatibilityFallbackHandlerBaseContract';
import SafeProvider from '../../../SafeProvider';
import { SafeVersion, CompatibilityFallbackHandlerContract_v1_3_0_Abi, CompatibilityFallbackHandlerContract_v1_3_0_Contract } from '@safe-global/safe-core-sdk-types';
/**
 * CompatibilityFallbackHandlerContract_v1_3_0  is the implementation specific to the CompatibilityFallbackHandler contract version 1.3.0.
 *
 * This class specializes in handling interactions with the CompatibilityFallbackHandler contract version 1.3.0 using Ethers.js v6.
 *
 * @extends  CompatibilityFallbackHandlerBaseContract<CompatibilityFallbackHandlerContract_v1_3_0_Abi> - Inherits from  CompatibilityFallbackHandlerBaseContract with ABI specific to CompatibilityFallbackHandler contract version 1.3.0.
 * @implements CompatibilityFallbackHandlerContract_v1_3_0_Contract - Implements the interface specific to CompatibilityFallbackHandler contract version 1.3.0.
 */
declare class CompatibilityFallbackHandlerContract_v1_3_0 extends CompatibilityFallbackHandlerBaseContract<CompatibilityFallbackHandlerContract_v1_3_0_Abi> implements CompatibilityFallbackHandlerContract_v1_3_0_Contract {
    safeVersion: SafeVersion;
    /**
     * Constructs an instance of CompatibilityFallbackHandlerContract_v1_3_0
     *
     * @param chainId - The chain ID where the contract resides.
     * @param safeProvider - An instance of SafeProvider.
     * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the CompatibilityFallbackHandler deployments based on the chainId and safeVersion.
     * @param customContractAbi - Optional custom ABI for the contract. If not provided, the default ABI for version 1.3.0 is used.
     */
    constructor(chainId: bigint, safeProvider: SafeProvider, customContractAddress?: string, customContractAbi?: CompatibilityFallbackHandlerContract_v1_3_0_Abi);
}
export default CompatibilityFallbackHandlerContract_v1_3_0;
