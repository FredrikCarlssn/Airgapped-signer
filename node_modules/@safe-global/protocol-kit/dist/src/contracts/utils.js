"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSignerCompatible = exports.isTypedDataSigner = exports.toTxResult = exports.zkSyncEraCreate2Address = exports.validateSafeDeploymentConfig = exports.validateSafeAccountConfig = exports.predictSafeAddress = exports.getPredictedSafeAddressInitCode = exports.getChainSpecificDefaultSaltNonce = exports.encodeSetupCallData = exports.encodeCreateProxyWithNonce = exports.PREDETERMINED_SALT_NONCE = void 0;
const ethers_1 = require("ethers");
const sha3_1 = require("@noble/hashes/sha3");
const config_1 = require("../contracts/config");
const constants_1 = require("../utils/constants");
const memoized_1 = require("../utils/memoized");
const ethereumjs_util_1 = require("ethereumjs-util");
const satisfies_1 = __importDefault(require("semver/functions/satisfies"));
const safeDeploymentContracts_1 = require("../contracts/safeDeploymentContracts");
// keccak256(toUtf8Bytes('Safe Account Abstraction'))
exports.PREDETERMINED_SALT_NONCE = '0xb1073742015cbcf5a3a4d9d1ae33ecf619439710b89475f92e2abd2117e90f90';
const ZKSYNC_MAINNET = 324n;
const ZKSYNC_TESTNET = 280n;
// For bundle size efficiency we store SafeProxy.sol/GnosisSafeProxy.sol zksync bytecode hash in hex.
// To get the values below we need to:
// 1. Compile Safe smart contracts for zksync
// 2. Get `deployedBytecode` from SafeProxy.json/GnosisSafeProxy.json
// 3. Use zksync-web3 SDK to get the bytecode hash
//    const bytecodeHash = zkSyncUtils.hashBytecode(${deployedBytecode})
// 4. Use ethers to convert the array into hex
//    const deployedBytecodeHash = ethers.hexlify(bytecodeHash)
const ZKSYNC_SAFE_PROXY_DEPLOYED_BYTECODE = {
    '1.3.0': {
        deployedBytecodeHash: '0x0100004124426fb9ebb25e27d670c068e52f9ba631bd383279a188be47e3f86d'
    }
};
// keccak256(toUtf8Bytes('zksyncCreate2'))
const ZKSYNC_CREATE2_PREFIX = '0x2020dba91b30cc0006188af794c2fb30dd8520db7e2c088b7fc7c103c00ca494';
function encodeCreateProxyWithNonce(safeProxyFactoryContract, safeSingletonAddress, initializer, salt) {
    return safeProxyFactoryContract.encode('createProxyWithNonce', [
        safeSingletonAddress,
        initializer,
        BigInt(salt || exports.PREDETERMINED_SALT_NONCE)
    ]);
}
exports.encodeCreateProxyWithNonce = encodeCreateProxyWithNonce;
const memoizedGetCompatibilityFallbackHandlerContract = (0, memoized_1.createMemoizedFunction)(safeDeploymentContracts_1.getCompatibilityFallbackHandlerContract);
async function encodeSetupCallData({ safeProvider, safeAccountConfig, safeContract, customContracts, customSafeVersion }) {
    const { owners, threshold, to = constants_1.ZERO_ADDRESS, data = constants_1.EMPTY_DATA, fallbackHandler, paymentToken = constants_1.ZERO_ADDRESS, payment = 0, paymentReceiver = constants_1.ZERO_ADDRESS } = safeAccountConfig;
    const safeVersion = customSafeVersion || (await safeContract.getVersion());
    if ((0, satisfies_1.default)(safeVersion, '<=1.0.0')) {
        return safeContract.encode('setup', [
            owners,
            threshold,
            to,
            data,
            paymentToken,
            payment,
            paymentReceiver
        ]);
    }
    let fallbackHandlerAddress = fallbackHandler;
    const isValidAddress = fallbackHandlerAddress !== undefined && (0, ethers_1.isAddress)(fallbackHandlerAddress);
    if (!isValidAddress) {
        const fallbackHandlerContract = await memoizedGetCompatibilityFallbackHandlerContract({
            safeProvider,
            safeVersion,
            customContracts
        });
        fallbackHandlerAddress = await fallbackHandlerContract.getAddress();
    }
    return safeContract.encode('setup', [
        owners,
        threshold,
        to,
        data,
        fallbackHandlerAddress,
        paymentToken,
        payment,
        paymentReceiver
    ]);
}
exports.encodeSetupCallData = encodeSetupCallData;
const memoizedGetProxyFactoryContract = (0, memoized_1.createMemoizedFunction)(({ safeProvider, safeVersion, customContracts }) => (0, safeDeploymentContracts_1.getProxyFactoryContract)({ safeProvider, safeVersion, customContracts }));
const memoizedGetProxyCreationCode = (0, memoized_1.createMemoizedFunction)(async ({ safeProvider, safeVersion, customContracts, chainId }) => {
    const safeProxyFactoryContract = await memoizedGetProxyFactoryContract({
        safeProvider,
        safeVersion,
        customContracts,
        chainId
    });
    return safeProxyFactoryContract.proxyCreationCode();
});
const memoizedGetSafeContract = (0, memoized_1.createMemoizedFunction)(({ safeProvider, safeVersion, isL1SafeSingleton, customContracts }) => (0, safeDeploymentContracts_1.getSafeContract)({ safeProvider, safeVersion, isL1SafeSingleton, customContracts }));
/**
 * Provides a chain-specific default salt nonce for generating unique addresses
 * for the same Safe configuration across different chains.
 *
 * @param {bigint} chainId - The chain ID associated with the chain.
 * @returns {string} The chain-specific salt nonce in hexadecimal format.
 */
function getChainSpecificDefaultSaltNonce(chainId) {
    return `0x${Buffer.from((0, sha3_1.keccak_256)(exports.PREDETERMINED_SALT_NONCE + chainId)).toString('hex')}`;
}
exports.getChainSpecificDefaultSaltNonce = getChainSpecificDefaultSaltNonce;
async function getPredictedSafeAddressInitCode({ safeProvider, chainId, safeAccountConfig, safeDeploymentConfig = {}, isL1SafeSingleton = false, customContracts }) {
    (0, exports.validateSafeAccountConfig)(safeAccountConfig);
    (0, exports.validateSafeDeploymentConfig)(safeDeploymentConfig);
    const { safeVersion = config_1.DEFAULT_SAFE_VERSION, saltNonce = getChainSpecificDefaultSaltNonce(chainId) } = safeDeploymentConfig;
    const safeProxyFactoryContract = await memoizedGetProxyFactoryContract({
        safeProvider,
        safeVersion,
        customContracts,
        chainId: chainId.toString()
    });
    const safeContract = await memoizedGetSafeContract({
        safeProvider,
        safeVersion,
        isL1SafeSingleton,
        customContracts,
        chainId: chainId.toString()
    });
    const initializer = await encodeSetupCallData({
        safeProvider,
        safeAccountConfig,
        safeContract,
        customContracts,
        customSafeVersion: safeVersion // it is more efficient if we provide the safeVersion manually
    });
    const encodedNonce = (0, ethereumjs_util_1.toBuffer)(safeProvider.encodeParameters(['uint256'], [saltNonce])).toString('hex');
    const safeSingletonAddress = await safeContract.getAddress();
    const initCodeCallData = encodeCreateProxyWithNonce(safeProxyFactoryContract, safeSingletonAddress, initializer, '0x' + encodedNonce);
    const safeProxyFactoryAddress = await safeProxyFactoryContract.getAddress();
    const initCode = `0x${[safeProxyFactoryAddress, initCodeCallData].reduce((acc, x) => acc + x.replace('0x', ''), '')}`;
    return initCode;
}
exports.getPredictedSafeAddressInitCode = getPredictedSafeAddressInitCode;
async function predictSafeAddress({ safeProvider, chainId, safeAccountConfig, safeDeploymentConfig = {}, isL1SafeSingleton = false, customContracts }) {
    (0, exports.validateSafeAccountConfig)(safeAccountConfig);
    (0, exports.validateSafeDeploymentConfig)(safeDeploymentConfig);
    const { safeVersion = config_1.DEFAULT_SAFE_VERSION, saltNonce = getChainSpecificDefaultSaltNonce(chainId) } = safeDeploymentConfig;
    const safeProxyFactoryContract = await memoizedGetProxyFactoryContract({
        safeProvider,
        safeVersion,
        customContracts,
        chainId: chainId.toString()
    });
    const proxyCreationCode = await memoizedGetProxyCreationCode({
        safeProvider,
        safeVersion,
        customContracts,
        chainId: chainId.toString()
    });
    const safeContract = await memoizedGetSafeContract({
        safeProvider,
        safeVersion,
        isL1SafeSingleton,
        customContracts,
        chainId: chainId.toString()
    });
    const initializer = await encodeSetupCallData({
        safeProvider,
        safeAccountConfig,
        safeContract,
        customContracts,
        customSafeVersion: safeVersion // it is more efficient if we provide the safeVersion manually
    });
    const encodedNonce = (0, ethereumjs_util_1.toBuffer)(safeProvider.encodeParameters(['uint256'], [saltNonce])).toString('hex');
    const salt = (0, ethereumjs_util_1.keccak256)((0, ethereumjs_util_1.toBuffer)('0x' + (0, ethereumjs_util_1.keccak256)((0, ethereumjs_util_1.toBuffer)(initializer)).toString('hex') + encodedNonce));
    const input = safeProvider.encodeParameters(['address'], [await safeContract.getAddress()]);
    const from = await safeProxyFactoryContract.getAddress();
    // On the zkSync Era chain, the counterfactual deployment address is calculated differently
    const isZkSyncEraChain = [ZKSYNC_MAINNET, ZKSYNC_TESTNET].includes(chainId);
    if (isZkSyncEraChain) {
        const proxyAddress = zkSyncEraCreate2Address(from, safeVersion, salt, input);
        return safeProvider.getChecksummedAddress(proxyAddress);
    }
    const constructorData = (0, ethereumjs_util_1.toBuffer)(input).toString('hex');
    const initCode = proxyCreationCode + constructorData;
    const proxyAddress = '0x' + (0, ethereumjs_util_1.generateAddress2)((0, ethereumjs_util_1.toBuffer)(from), (0, ethereumjs_util_1.toBuffer)(salt), (0, ethereumjs_util_1.toBuffer)(initCode)).toString('hex');
    return safeProvider.getChecksummedAddress(proxyAddress);
}
exports.predictSafeAddress = predictSafeAddress;
const validateSafeAccountConfig = ({ owners, threshold }) => {
    if (owners.length <= 0)
        throw new Error('Owner list must have at least one owner');
    if (threshold <= 0)
        throw new Error('Threshold must be greater than or equal to 1');
    if (threshold > owners.length)
        throw new Error('Threshold must be lower than or equal to owners length');
};
exports.validateSafeAccountConfig = validateSafeAccountConfig;
const validateSafeDeploymentConfig = ({ saltNonce }) => {
    if (saltNonce && BigInt(saltNonce) < 0)
        throw new Error('saltNonce must be greater than or equal to 0');
};
exports.validateSafeDeploymentConfig = validateSafeDeploymentConfig;
/**
 * Generates a zkSync Era address. zkSync Era uses a distinct address derivation method compared to Ethereum
 * see: https://era.zksync.io/docs/reference/architecture/differences-with-ethereum.html#address-derivation
 *
 * @param {string} from - The sender's address.
 * @param {SafeVersion} safeVersion - The version of the safe.
 * @param {Buffer} salt - The salt used for address derivation.
 * @param {string} input - Additional input data for the derivation.
 *
 * @returns {string} The derived zkSync Era address.
 */
function zkSyncEraCreate2Address(from, safeVersion, salt, input) {
    const bytecodeHash = ZKSYNC_SAFE_PROXY_DEPLOYED_BYTECODE[safeVersion].deployedBytecodeHash;
    const inputHash = (0, ethereumjs_util_1.keccak256)((0, ethereumjs_util_1.toBuffer)(input));
    const addressBytes = (0, ethereumjs_util_1.keccak256)((0, ethereumjs_util_1.toBuffer)(ZKSYNC_CREATE2_PREFIX +
        (0, ethers_1.zeroPadValue)(from, 32).slice(2) +
        salt.toString('hex') +
        bytecodeHash.slice(2) +
        inputHash.toString('hex')))
        .toString('hex')
        .slice(24);
    return addressBytes;
}
exports.zkSyncEraCreate2Address = zkSyncEraCreate2Address;
function toTxResult(transactionResponse, options) {
    return {
        hash: transactionResponse.hash,
        options,
        transactionResponse
    };
}
exports.toTxResult = toTxResult;
function isTypedDataSigner(signer) {
    const isPasskeySigner = !!signer?.passkeyRawId;
    return signer.signTypedData !== undefined || !isPasskeySigner;
}
exports.isTypedDataSigner = isTypedDataSigner;
/**
 * Check if the signerOrProvider is compatible with `Signer`
 * @param signerOrProvider - Signer or provider
 * @returns true if the parameter is compatible with `Signer`
 */
function isSignerCompatible(signerOrProvider) {
    const candidate = signerOrProvider;
    const isSigntransactionCompatible = typeof candidate.signTransaction === 'function';
    const isSignMessageCompatible = typeof candidate.signMessage === 'function';
    const isGetAddressCompatible = typeof candidate.getAddress === 'function';
    return isSigntransactionCompatible && isSignMessageCompatible && isGetAddressCompatible;
}
exports.isSignerCompatible = isSignerCompatible;
//# sourceMappingURL=utils.js.map