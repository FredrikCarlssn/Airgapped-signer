import { PasskeyArgType } from '../../types/passkeys';
import { SafeWebAuthnSharedSignerContractImplementationType } from '../../types/contracts';
/**
 * Returns true if the passkey signer is a shared signer
 * @returns {Promise<string>} A promise that resolves to the signer's address.
 */
declare function isSharedSigner(passkey: PasskeyArgType, safeWebAuthnSharedSignerContract: SafeWebAuthnSharedSignerContractImplementationType, safeAddress: string, owners: string[], chainId: string): Promise<boolean>;
export default isSharedSigner;
