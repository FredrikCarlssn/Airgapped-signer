"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractPasskeyData_1 = require("./extractPasskeyData");
/**
 * Returns true if the passkey signer is a shared signer
 * @returns {Promise<string>} A promise that resolves to the signer's address.
 */
async function isSharedSigner(passkey, safeWebAuthnSharedSignerContract, safeAddress, owners, chainId) {
    const sharedSignerContractAddress = await safeWebAuthnSharedSignerContract.getAddress();
    // is a shared signer if the shared signer contract address is present in the owners and its configured in the Safe slot
    if (safeAddress && owners.includes(sharedSignerContractAddress)) {
        const [sharedSignerSlot] = await safeWebAuthnSharedSignerContract.getConfiguration([
            safeAddress
        ]);
        const { x, y, verifiers } = sharedSignerSlot;
        const passkeyVerifierAddress = passkey.customVerifierAddress || (0, extractPasskeyData_1.getDefaultFCLP256VerifierAddress)(chainId.toString());
        const isSharedSigner = BigInt(passkey.coordinates.x) === x &&
            BigInt(passkey.coordinates.y) === y &&
            BigInt(passkeyVerifierAddress) === verifiers;
        return isSharedSigner;
    }
    return false;
}
exports.default = isSharedSigner;
//# sourceMappingURL=isSharedSigner.js.map