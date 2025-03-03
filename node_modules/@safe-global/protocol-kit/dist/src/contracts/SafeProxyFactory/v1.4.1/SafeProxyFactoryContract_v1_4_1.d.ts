import { ContractRunner } from 'ethers';
import SafeProxyFactoryBaseContract, { CreateProxyProps } from '../../../contracts/SafeProxyFactory/SafeProxyFactoryBaseContract';
import { SafeVersion, SafeProxyFactoryContract_v1_4_1_Abi, SafeProxyFactoryContract_v1_4_1_Contract, SafeProxyFactoryContract_v1_4_1_Function } from '@safe-global/safe-core-sdk-types';
import SafeProvider from '../../../SafeProvider';
/**
 * SafeProxyFactoryContract_v1_4_1  is the implementation specific to the Safe Proxy Factory contract version 1.4.1.
 *
 * This class specializes in handling interactions with the Safe Proxy Factory contract version 1.4.1 using Ethers.js v6.
 *
 * @extends SafeProxyFactoryBaseContract<SafeProxyFactoryContract_v1_4_1_Abi> - Inherits from SafeProxyFactoryBaseContract with ABI specific to Safe Proxy Factory contract version 1.4.1.
 * @implements SafeProxyFactoryContract_v1_4_1_Contract - Implements the interface specific to Safe Proxy Factory contract version 1.4.1.
 */
declare class SafeProxyFactoryContract_v1_4_1 extends SafeProxyFactoryBaseContract<SafeProxyFactoryContract_v1_4_1_Abi> implements SafeProxyFactoryContract_v1_4_1_Contract {
    safeVersion: SafeVersion;
    /**
     * Constructs an instance of SafeProxyFactoryContract_v1_4_1
     *
     * @param chainId - The chain ID where the contract resides.
     * @param safeProvider - An instance of SafeProvider.
     * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the Safe deployments based on the chainId and safeVersion.
     * @param customContractAbi - Optional custom ABI for the contract. If not provided, the default ABI for version 1.4.1 is used.
     */
    constructor(chainId: bigint, safeProvider: SafeProvider, customContractAddress?: string, customContractAbi?: SafeProxyFactoryContract_v1_4_1_Abi, runner?: ContractRunner | null);
    /**
     * Returns the ID of the chain the contract is currently deployed on.
     * @returns Array[chainId]
     */
    getChainId: SafeProxyFactoryContract_v1_4_1_Function<'getChainId'>;
    /**
     * Allows to retrieve the creation code used for the Proxy deployment. With this it is easily possible to calculate predicted address.
     * @returns Array[creationCode]
     */
    proxyCreationCode: SafeProxyFactoryContract_v1_4_1_Function<'proxyCreationCode'>;
    /**
     * Deploys a new chain-specific proxy with singleton and salt. Optionally executes an initializer call to a new proxy.
     * @param args - Array[singleton, initializer, saltNonce]
     * @returns Array[proxy]
     */
    createChainSpecificProxyWithNonce: SafeProxyFactoryContract_v1_4_1_Function<'createChainSpecificProxyWithNonce'>;
    /**
     * Deploy a new proxy with singleton and salt.
     * Optionally executes an initializer call to a new proxy and calls a specified callback address.
     * @param args - Array[singleton, initializer, saltNonce, callback]
     * @returns Array[proxy]
     */
    createProxyWithCallback: SafeProxyFactoryContract_v1_4_1_Function<'createProxyWithCallback'>;
    /**
     * Deploys a new proxy with singleton and salt. Optionally executes an initializer call to a new proxy.
     * @param args - Array[singleton, initializer, saltNonce]
     * @returns Array[proxy]
     */
    createProxyWithNonce: SafeProxyFactoryContract_v1_4_1_Function<'createProxyWithNonce'>;
    /**
     * Allows to create new proxy contract and execute a message call to the new proxy within one transaction.
     * @param {CreateProxyProps} props - Properties for the new proxy contract.
     * @returns The address of the new proxy contract.
     */
    createProxyWithOptions({ safeSingletonAddress, initializer, saltNonce, options, callback }: CreateProxyProps): Promise<string>;
}
export default SafeProxyFactoryContract_v1_4_1;
