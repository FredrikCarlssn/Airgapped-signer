"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const config_1 = require("../contracts/config");
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
class BaseContract {
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
    constructor(contractName, chainId, safeProvider, defaultAbi, safeVersion, customContractAddress, customContractAbi, runner) {
        this.getAddress = () => {
            return this.contract.getAddress();
        };
        this.encode = (functionToEncode, args) => {
            return this.contract.interface.encodeFunctionData(functionToEncode, args);
        };
        this.estimateGas = (functionToEstimate, args, options = {}) => {
            const contractMethodToEstimate = this.contract.getFunction(functionToEstimate);
            return contractMethodToEstimate.estimateGas(...args, options);
        };
        const deployment = (0, config_1.getContractDeployment)(safeVersion, chainId, contractName);
        const contractAddress = customContractAddress ||
            deployment?.networkAddresses[chainId.toString()] ||
            deployment?.defaultAddress;
        if (!contractAddress) {
            throw new Error(`Invalid ${contractName.replace('Version', '')} contract address`);
        }
        this.contractName = contractName;
        this.safeVersion = safeVersion;
        this.contractAddress = contractAddress;
        this.contractAbi =
            customContractAbi ||
                deployment?.abi || // this cast is required because abi is set as any[] in safe-deployments
                defaultAbi; // if no customAbi and no abi is present in the safe-deployments we use our hardcoded abi
        this.runner = runner || safeProvider.getExternalProvider();
        this.safeProvider = safeProvider;
    }
    async init() {
        this.contract = new ethers_1.Contract(this.contractAddress, this.contractAbi, (await this.safeProvider.getExternalSigner()) || this.runner);
    }
}
exports.default = BaseContract;
//# sourceMappingURL=BaseContract.js.map