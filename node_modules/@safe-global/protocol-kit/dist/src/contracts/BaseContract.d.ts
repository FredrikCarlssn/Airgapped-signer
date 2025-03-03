import { Abi } from 'abitype';
import { Contract, ContractRunner, InterfaceAbi } from 'ethers';
import { contractName } from '../contracts/config';
import SafeProvider from '../SafeProvider';
import { EncodeFunction, EstimateGasFunction, GetAddressFunction, SafeVersion } from '@safe-global/safe-core-sdk-types';
/**
 * Abstract class BaseContract
 * It is designed to be instantiated for different contracts.
 *
 * This abstract class sets up the Ethers v6 Contract object that interacts with the smart contract.
 *
 * Subclasses of BaseContract are expected to represent specific contracts.
 *
 * @template ContractAbiType - The ABI type specific to the version of the contract, extending InterfaceAbi from Ethers.
 *
 * Example subclasses:
 * - SafeBaseContract<SafeContractAbiType> extends BaseContract<SafeContractAbiType>
 * - CreateCallBaseContract<CreateCallContractAbiType> extends BaseContract<CreateCallContractAbiType>
 * - SafeProxyFactoryBaseContract<SafeProxyFactoryContractAbiType> extends BaseContract<SafeProxyFactoryContractAbiType>
 */
declare class BaseContract<ContractAbiType extends InterfaceAbi & Abi> {
    contractAbi: ContractAbiType;
    contractAddress: string;
    contractName: contractName;
    safeVersion: SafeVersion;
    safeProvider: SafeProvider;
    contract: Contract;
    runner?: ContractRunner | null;
    /**
     * @constructor
     * Constructs an instance of BaseContract.
     *
     * @param contractName - The contract name.
     * @param chainId - The chain ID of the contract.
     * @param safeProvider - An instance of SafeProvider.
     * @param defaultAbi - The default ABI for the contract. It should be compatible with the specific version of the contract.
     * @param safeVersion - The version of the Safe contract.
     * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the Safe deployments based on the chainId and safeVersion.
     * @param customContractAbi - Optional custom ABI for the contract. If not provided, the ABI is derived from the Safe deployments or the defaultAbi is used.
     */
    constructor(contractName: contractName, chainId: bigint, safeProvider: SafeProvider, defaultAbi: ContractAbiType, safeVersion: SafeVersion, customContractAddress?: string, customContractAbi?: ContractAbiType, runner?: ContractRunner | null);
    init(): Promise<void>;
    getAddress: GetAddressFunction;
    encode: EncodeFunction<ContractAbiType>;
    estimateGas: EstimateGasFunction<ContractAbiType>;
}
export default BaseContract;
