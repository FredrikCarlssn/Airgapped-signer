"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CreateCallBaseContract_1 = __importDefault(require("../../../contracts/CreateCall/CreateCallBaseContract"));
const safe_core_sdk_types_1 = require("@safe-global/safe-core-sdk-types");
const utils_1 = require("../../../contracts/utils");
/**
 * CreateCallContract_v1_4_1  is the implementation specific to the CreateCall contract version 1.4.1.
 *
 * This class specializes in handling interactions with the CreateCall contract version 1.4.1 using Ethers.js v6.
 *
 * @extends CreateCallBaseContract<CreateCallContract_v1_4_1_Abi> - Inherits from CreateCallBaseContract with ABI specific to CreateCall contract version 1.4.1.
 * @implements CreateCallContract_v1_4_1_Contract - Implements the interface specific to CreateCall contract version 1.4.1.
 */
class CreateCallContract_v1_4_1 extends CreateCallBaseContract_1.default {
    /**
     * Constructs an instance of CreateCallContract_v1_4_1
     *
     * @param chainId - The chain ID where the contract resides.
     * @param safeProvider - An instance of SafeProvider.
     * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the CreateCall deployments based on the chainId and safeVersion.
     * @param customContractAbi - Optional custom ABI for the contract. If not provided, the default ABI for version 1.4.1 is used.
     */
    constructor(chainId, safeProvider, customContractAddress, customContractAbi) {
        const safeVersion = '1.4.1';
        const defaultAbi = safe_core_sdk_types_1.createCall_1_4_1_ContractArtifacts.abi;
        super(chainId, safeProvider, defaultAbi, safeVersion, customContractAddress, customContractAbi);
        /**
         * @param args - Array[value, deploymentData]
         * @param options - TransactionOptions
         * @returns Promise<TransactionResult>
         */
        this.performCreate = async (args, options) => {
            if (options && !options.gasLimit) {
                options.gasLimit = (await this.estimateGas('performCreate', args, options)).toString();
            }
            const txResponse = await this.contract.performCreate(...args, options);
            return (0, utils_1.toTxResult)(txResponse, options);
        };
        /**
         * @param args - Array[value, deploymentData, salt]
         * @param options - TransactionOptions
         * @returns Promise<TransactionResult>
         */
        this.performCreate2 = async (args, options) => {
            if (options && !options.gasLimit) {
                options.gasLimit = (await this.estimateGas('performCreate2', [...args], { ...options })).toString();
            }
            const txResponse = await this.contract.performCreate2(...args);
            return (0, utils_1.toTxResult)(txResponse, options);
        };
        this.safeVersion = safeVersion;
    }
}
exports.default = CreateCallContract_v1_4_1;
//# sourceMappingURL=CreateCallContract_v1_4_1.js.map