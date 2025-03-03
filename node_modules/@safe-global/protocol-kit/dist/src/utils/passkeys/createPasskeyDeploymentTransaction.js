"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const SafeProvider_1 = __importDefault(require("../../SafeProvider"));
/**
 * Creates the deployment transaction to create a passkey signer.
 *
 * @param {Safe} safe The protocol-kit instance of the current Safe
 * @param {PasskeyArgType} passkey The passkey object
 * @returns {Promise<{ to: string; value: string; data: string; }>} The deployment transaction to create a passkey signer.
 */
async function createPasskeyDeploymentTransaction(safe, passkey) {
    const safeVersion = await safe.getContractVersion();
    const safeAddress = await safe.getAddress();
    const owners = await safe.getOwners();
    const safePasskeyProvider = await SafeProvider_1.default.init(safe.getSafeProvider().provider, passkey, safeVersion, safe.getContractManager().contractNetworks, safeAddress, owners);
    const passkeySigner = (await safePasskeyProvider.getExternalSigner());
    const passkeyAddress = await passkeySigner.getAddress();
    const provider = safe.getSafeProvider().getExternalProvider();
    const isPasskeyDeployed = (await provider.getCode(passkeyAddress)) !== constants_1.EMPTY_DATA;
    if (isPasskeyDeployed) {
        throw new Error('Passkey Signer contract already deployed');
    }
    const passkeySignerDeploymentTransaction = {
        to: await passkeySigner.safeWebAuthnSignerFactoryContract.getAddress(),
        value: '0',
        data: passkeySigner.encodeCreateSigner()
    };
    return passkeySignerDeploymentTransaction;
}
exports.default = createPasskeyDeploymentTransaction;
//# sourceMappingURL=createPasskeyDeploymentTransaction.js.map