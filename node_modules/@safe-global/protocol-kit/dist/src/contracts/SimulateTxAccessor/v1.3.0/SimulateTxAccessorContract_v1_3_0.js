"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SimulateTxAccessorBaseContract_1 = __importDefault(require("../../../contracts/SimulateTxAccessor/SimulateTxAccessorBaseContract"));
const safe_core_sdk_types_1 = require("@safe-global/safe-core-sdk-types");
/**
 * SimulateTxAccessorContract_v1_3_0  is the implementation specific to the SimulateTxAccessor contract version 1.3.0.
 *
 * This class specializes in handling interactions with the SimulateTxAccessor contract version 1.3.0 using Ethers.js v6.
 *
 * @extends SimulateTxAccessorBaseContract<SimulateTxAccessorContract_v1_3_0_Abi> - Inherits from SimulateTxAccessorBaseContract with ABI specific to SimulateTxAccessor contract version 1.3.0.
 * @implements SimulateTxAccessorContract_v1_3_0_Contract - Implements the interface specific to SimulateTxAccessor contract version 1.3.0.
 */
class SimulateTxAccessorContract_v1_3_0 extends SimulateTxAccessorBaseContract_1.default {
    /**
     * Constructs an instance of SimulateTxAccessorContract_v1_3_0
     *
     * @param chainId - The chain ID where the contract resides.
     * @param safeProvider - An instance of SafeProvider.
     * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the SimulateTxAccessor deployments based on the chainId and safeVersion.
     * @param customContractAbi - Optional custom ABI for the contract. If not provided, the default ABI for version 1.3.0 is used.
     */
    constructor(chainId, safeProvider, customContractAddress, customContractAbi) {
        const safeVersion = '1.3.0';
        const defaultAbi = safe_core_sdk_types_1.simulateTxAccessor_1_3_0_ContractArtifacts.abi;
        super(chainId, safeProvider, defaultAbi, safeVersion, customContractAddress, customContractAbi);
        /**
         * @param args - Array[to, value, data, operation]
         * @returns Array[estimate, success, returnData]
         */
        this.simulate = (args) => {
            return this.contract.simulate(...args);
        };
        this.safeVersion = safeVersion;
    }
}
exports.default = SimulateTxAccessorContract_v1_3_0;
//# sourceMappingURL=SimulateTxAccessorContract_v1_3_0.js.map