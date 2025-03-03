import CreateCallBaseContract from '../../../contracts/CreateCall/CreateCallBaseContract';
import { SafeVersion, CreateCallContract_v1_3_0_Abi, CreateCallContract_v1_3_0_Contract, SafeContractFunction } from '@safe-global/safe-core-sdk-types';
import SafeProvider from '../../../SafeProvider';
/**
 * CreateCallContract_v1_3_0  is the implementation specific to the CreateCall contract version 1.3.0.
 *
 * This class specializes in handling interactions with the CreateCall contract version 1.3.0 using Ethers.js v6.
 *
 * @extends CreateCallBaseContract<CreateCallContract_v1_3_0_Abi> - Inherits from CreateCallBaseContract with ABI specific to CreateCall contract version 1.3.0.
 * @implements CreateCallContract_v1_3_0_Contract - Implements the interface specific to CreateCall contract version 1.3.0.
 */
declare class CreateCallContract_v1_3_0 extends CreateCallBaseContract<CreateCallContract_v1_3_0_Abi> implements CreateCallContract_v1_3_0_Contract {
    safeVersion: SafeVersion;
    /**
     * Constructs an instance of CreateCallContract_v1_3_0
     *
     * @param chainId - The chain ID where the contract resides.
     * @param safeProvider - An instance of SafeProvider.
     * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the CreateCall deployments based on the chainId and safeVersion.
     * @param customContractAbi - Optional custom ABI for the contract. If not provided, the default ABI for version 1.3.0 is used.
     */
    constructor(chainId: bigint, safeProvider: SafeProvider, customContractAddress?: string, customContractAbi?: CreateCallContract_v1_3_0_Abi);
    /**
     * @param args - Array[value, deploymentData]
     * @param options - TransactionOptions
     * @returns Promise<TransactionResult>
     */
    performCreate: SafeContractFunction<CreateCallContract_v1_3_0_Abi, 'performCreate'>;
    /**
     * @param args - Array[value, deploymentData, salt]
     * @param options - TransactionOptions
     * @returns Promise<TransactionResult>
     */
    performCreate2: SafeContractFunction<CreateCallContract_v1_3_0_Abi, 'performCreate2'>;
}
export default CreateCallContract_v1_3_0;
