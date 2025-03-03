import { ethers, AbstractSigner, Provider } from 'ethers';
import { PasskeyCoordinates, PasskeyArgType } from '../../types/passkeys';
import { SafeWebAuthnSharedSignerContractImplementationType, SafeWebAuthnSignerFactoryContractImplementationType } from '../../types/contracts';
/**
 * Represents a Signer that is created using a passkey.
 * This class extends the AbstractSigner to implement signer functionalities.
 *
 * @extends {AbstractSigner}
 */
declare class PasskeySigner extends AbstractSigner {
    /**
     * The raw identifier of the passkey.
     * see: https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/rawId
     */
    passkeyRawId: ArrayBuffer;
    /**
     * Passkey Coordinates.
     */
    coordinates: PasskeyCoordinates;
    /**
     * P256 Verifier Contract address.
     */
    verifierAddress: string;
    /**
     * chainId
     */
    chainId: string;
    /**
     * signerAddress
     */
    signerAddress: string;
    /**
     * Safe WebAuthn signer factory Contract.
     */
    safeWebAuthnSignerFactoryContract: SafeWebAuthnSignerFactoryContractImplementationType;
    /**
     * Safe WebAuthn shared signer Contract.
     */
    safeWebAuthnSharedSignerContract: SafeWebAuthnSharedSignerContractImplementationType;
    constructor(passkey: PasskeyArgType, safeWebAuthnSignerFactoryContract: SafeWebAuthnSignerFactoryContractImplementationType, safeWebAuthnSharedSignerContract: SafeWebAuthnSharedSignerContractImplementationType, provider: Provider, chainId: string, signerAddress: string);
    static init(passkey: PasskeyArgType, safeWebAuthnSignerFactoryContract: SafeWebAuthnSignerFactoryContractImplementationType, safeWebAuthnSharedSignerContract: SafeWebAuthnSharedSignerContractImplementationType, provider: Provider, safeAddress: string, owners: string[], chainId: string): Promise<PasskeySigner>;
    /**
     * Returns the address associated with the passkey signer.
     * @returns {Promise<string>} A promise that resolves to the signer's address.
     */
    getAddress(): Promise<string>;
    /**
     * Encodes the createSigner contract function.
     * @returns {string} The encoded data to create a signer.
     */
    encodeCreateSigner(): string;
    /**
     * Signs the provided data using the passkey.
     * @param {Uint8Array} data - The data to be signed.
     * @returns {Promise<string>} A promise that resolves to the signed data.
     */
    sign(data: Uint8Array): Promise<string>;
    connect(provider: Provider): ethers.Signer;
    signTransaction(): Promise<string>;
    signMessage(message: string | Uint8Array): Promise<string>;
    signTypedData(): Promise<string>;
}
export default PasskeySigner;
