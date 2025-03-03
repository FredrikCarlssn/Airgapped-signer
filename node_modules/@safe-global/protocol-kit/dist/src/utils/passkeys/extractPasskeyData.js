"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultFCLP256VerifierAddress = exports.hexStringToUint8Array = exports.extractPasskeyCoordinates = exports.extractPasskeyData = void 0;
const safe_modules_deployments_1 = require("@safe-global/safe-modules-deployments");
const buffer_1 = require("buffer");
/**
 * Extracts and returns the passkey data (coordinates and rawId) from a given passkey Credential.
 *
 * @param {Credential} passkeyCredential - The passkey credential generated via `navigator.credentials.create()` using correct parameters.
 * @returns {Promise<PasskeyArgType>} A promise that resolves to an object containing the coordinates and the rawId derived from the passkey.
 * @throws {Error} Throws an error if the coordinates could not be extracted
 */
async function extractPasskeyData(passkeyCredential) {
    const passkey = passkeyCredential;
    const attestationResponse = passkey.response;
    const publicKey = attestationResponse.getPublicKey();
    if (!publicKey) {
        throw new Error('Failed to generate passkey Coordinates. getPublicKey() failed');
    }
    const coordinates = await extractPasskeyCoordinates(publicKey);
    const rawId = buffer_1.Buffer.from(passkey.rawId).toString('hex');
    return {
        rawId,
        coordinates
    };
}
exports.extractPasskeyData = extractPasskeyData;
/**
 * Extracts and returns coordinates from a given passkey public key.
 *
 * @param {ArrayBuffer} publicKey - The public key of the passkey from which coordinates will be extracted.
 * @returns {Promise<PasskeyCoordinates>} A promise that resolves to an object containing the coordinates derived from the public key of the passkey.
 * @throws {Error} Throws an error if the coordinates could not be extracted via `crypto.subtle.exportKey()`
 */
async function extractPasskeyCoordinates(publicKey) {
    const algorithm = {
        name: 'ECDSA',
        namedCurve: 'P-256',
        hash: { name: 'SHA-256' }
    };
    const key = await crypto.subtle.importKey('spki', publicKey, algorithm, true, ['verify']);
    const { x, y } = await crypto.subtle.exportKey('jwk', key);
    const isValidCoordinates = !!x && !!y;
    if (!isValidCoordinates) {
        throw new Error('Failed to generate passkey Coordinates. crypto.subtle.exportKey() failed');
    }
    return {
        x: '0x' + buffer_1.Buffer.from(x, 'base64').toString('hex'),
        y: '0x' + buffer_1.Buffer.from(y, 'base64').toString('hex')
    };
}
exports.extractPasskeyCoordinates = extractPasskeyCoordinates;
// FIXME use Viem `hexToBytes`
function hexStringToUint8Array(hexString) {
    const arr = [];
    for (let i = 0; i < hexString.length; i += 2) {
        arr.push(parseInt(hexString.substr(i, 2), 16));
    }
    return new Uint8Array(arr);
}
exports.hexStringToUint8Array = hexStringToUint8Array;
function getDefaultFCLP256VerifierAddress(chainId) {
    const network = BigInt(chainId).toString();
    const FCLP256VerifierDeployment = (0, safe_modules_deployments_1.getFCLP256VerifierDeployment)({
        version: '0.2.0',
        released: true,
        network
    });
    const verifierAddress = FCLP256VerifierDeployment?.networkAddresses[network];
    if (!verifierAddress) {
        throw new Error('FCLP256Verifier address not found');
    }
    return verifierAddress;
}
exports.getDefaultFCLP256VerifierAddress = getDefaultFCLP256VerifierAddress;
//# sourceMappingURL=extractPasskeyData.js.map