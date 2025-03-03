"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CompatibilityFallbackHandlerBaseContract_1 = __importDefault(require("../../../contracts/CompatibilityFallbackHandler/CompatibilityFallbackHandlerBaseContract"));
const safe_core_sdk_types_1 = require("@safe-global/safe-core-sdk-types");
/**
 * CompatibilityFallbackHandlerContract_v1_3_0  is the implementation specific to the CompatibilityFallbackHandler contract version 1.3.0.
 *
 * This class specializes in handling interactions with the CompatibilityFallbackHandler contract version 1.3.0 using Ethers.js v6.
 *
 * @extends  CompatibilityFallbackHandlerBaseContract<CompatibilityFallbackHandlerContract_v1_3_0_Abi> - Inherits from  CompatibilityFallbackHandlerBaseContract with ABI specific to CompatibilityFallbackHandler contract version 1.3.0.
 * @implements CompatibilityFallbackHandlerContract_v1_3_0_Contract - Implements the interface specific to CompatibilityFallbackHandler contract version 1.3.0.
 */
class CompatibilityFallbackHandlerContract_v1_3_0 extends CompatibilityFallbackHandlerBaseContract_1.default {
    /**
     * Constructs an instance of CompatibilityFallbackHandlerContract_v1_3_0
     *
     * @param chainId - The chain ID where the contract resides.
     * @param safeProvider - An instance of SafeProvider.
     * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the CompatibilityFallbackHandler deployments based on the chainId and safeVersion.
     * @param customContractAbi - Optional custom ABI for the contract. If not provided, the default ABI for version 1.3.0 is used.
     */
    constructor(chainId, safeProvider, customContractAddress, customContractAbi) {
        const safeVersion = '1.3.0';
        const defaultAbi = safe_core_sdk_types_1.compatibilityFallbackHandler_1_3_0_ContractArtifacts.abi;
        super(chainId, safeProvider, defaultAbi, safeVersion, customContractAddress, customContractAbi);
        this.safeVersion = safeVersion;
    }
}
exports.default = CompatibilityFallbackHandlerContract_v1_3_0;
//# sourceMappingURL=CompatibilityFallbackHandlerContract_v1_3_0.js.map