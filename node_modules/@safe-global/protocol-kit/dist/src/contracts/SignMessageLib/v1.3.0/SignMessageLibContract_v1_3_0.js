"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../contracts/utils");
const SignMessageLibBaseContract_1 = __importDefault(require("../../../contracts/SignMessageLib/SignMessageLibBaseContract"));
const safe_core_sdk_types_1 = require("@safe-global/safe-core-sdk-types");
/**
 * SignMessageLibContract_v1_3_0  is the implementation specific to the SignMessageLib contract version 1.3.0.
 *
 * This class specializes in handling interactions with the SignMessageLib contract version 1.3.0 using Ethers.js v6.
 *
 * @extends  SignMessageLibBaseContract<SignMessageLibContract_v1_3_0_Abi> - Inherits from  SignMessageLibBaseContract with ABI specific to SignMessageLib contract version 1.3.0.
 * @implements SignMessageLibContract_v1_3_0_Contract - Implements the interface specific to SignMessageLib contract version 1.3.0.
 */
class SignMessageLibContract_v1_3_0 extends SignMessageLibBaseContract_1.default {
    /**
     * Constructs an instance of SignMessageLibContract_v1_3_0
     *
     * @param chainId - The chain ID where the contract resides.
     * @param safeProvider - An instance of SafeProvider.
     * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the SignMessageLib deployments based on the chainId and safeVersion.
     * @param customContractAbi - Optional custom ABI for the contract. If not provided, the default ABI for version 1.3.0 is used.
     */
    constructor(chainId, safeProvider, customContractAddress, customContractAbi) {
        const safeVersion = '1.3.0';
        const defaultAbi = safe_core_sdk_types_1.signMessageLib_1_3_0_ContractArtifacts.abi;
        super(chainId, safeProvider, defaultAbi, safeVersion, customContractAddress, customContractAbi);
        /**
         * @param args - Array[message]
         */
        this.getMessageHash = async (args) => {
            return [await this.contract.getMessageHash(...args)];
        };
        /**
         * @param args - Array[data]
         */
        this.signMessage = async (data, options) => {
            if (options && !options.gasLimit) {
                options.gasLimit = Number(await this.estimateGas('signMessage', data, { ...options }));
            }
            const txResponse = await this.contract.signMessage(data, { ...options });
            return (0, utils_1.toTxResult)(txResponse, options);
        };
        this.safeVersion = safeVersion;
    }
}
exports.default = SignMessageLibContract_v1_3_0;
//# sourceMappingURL=SignMessageLibContract_v1_3_0.js.map