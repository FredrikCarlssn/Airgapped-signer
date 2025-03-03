"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SafeProvider_1 = __importDefault(require("../../SafeProvider"));
/**
 * Returns the owner address associated with the specific passkey.
 *
 * @param {Safe} safe The protocol-kit instance of the current Safe
 * @param {PasskeyArgType} passkey The passkey to check the owner address
 * @returns {Promise<string>} Returns the passkey owner address associated with the passkey
 */
async function getPasskeyOwnerAddress(safe, passkey) {
    const safeVersion = await safe.getContractVersion();
    const safeAddress = await safe.getAddress();
    const owners = await safe.getOwners();
    const safePasskeyProvider = await SafeProvider_1.default.init(safe.getSafeProvider().provider, passkey, safeVersion, safe.getContractManager().contractNetworks, safeAddress, owners);
    const passkeySigner = await safePasskeyProvider.getExternalSigner();
    const passkeyOwnerAddress = await passkeySigner.getAddress();
    return passkeyOwnerAddress;
}
exports.default = getPasskeyOwnerAddress;
//# sourceMappingURL=getPasskeyOwnerAddress.js.map