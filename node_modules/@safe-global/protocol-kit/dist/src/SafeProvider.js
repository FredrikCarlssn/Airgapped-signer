"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _SafeProvider_externalProvider;
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const utils_1 = require("./utils");
const utils_2 = require("./contracts/utils");
const safeDeploymentContracts_1 = require("./contracts/safeDeploymentContracts");
const constants_1 = require("./utils/constants");
const contractInstances_1 = require("./contracts/contractInstances");
const PasskeySigner_1 = __importDefault(require("./utils/passkeys/PasskeySigner"));
const config_1 = require("./contracts/config");
class SafeProvider {
    constructor({ provider, signer }) {
        _SafeProvider_externalProvider.set(this, void 0);
        if (typeof provider === 'string') {
            __classPrivateFieldSet(this, _SafeProvider_externalProvider, new ethers_1.JsonRpcProvider(provider, undefined, { staticNetwork: true }), "f");
        }
        else {
            __classPrivateFieldSet(this, _SafeProvider_externalProvider, new ethers_1.BrowserProvider(provider), "f");
        }
        this.provider = provider;
        this.signer = signer;
    }
    getExternalProvider() {
        return __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f");
    }
    static async init(provider, signer, safeVersion = config_1.DEFAULT_SAFE_VERSION, contractNetworks, safeAddress, owners) {
        const isPasskeySigner = signer && typeof signer !== 'string';
        if (isPasskeySigner) {
            if (!(0, utils_1.hasSafeFeature)(utils_1.SAFE_FEATURES.PASSKEY_SIGNER, safeVersion)) {
                throw new Error('Current version of the Safe does not support the Passkey signer functionality');
            }
            const safeProvider = new SafeProvider({
                provider
            });
            const chainId = await safeProvider.getChainId();
            const customContracts = contractNetworks?.[chainId.toString()];
            let passkeySigner;
            const isPasskeySignerConfig = !(signer instanceof PasskeySigner_1.default);
            if (isPasskeySignerConfig) {
                // signer is type PasskeyArgType {rawId, coordinates, customVerifierAddress? }
                const safeWebAuthnSignerFactoryContract = await (0, safeDeploymentContracts_1.getSafeWebAuthnSignerFactoryContract)({
                    safeProvider,
                    safeVersion,
                    customContracts
                });
                const safeWebAuthnSharedSignerContract = await (0, safeDeploymentContracts_1.getSafeWebAuthnSharedSignerContract)({
                    safeProvider,
                    safeVersion,
                    customContracts
                });
                passkeySigner = await PasskeySigner_1.default.init(signer, safeWebAuthnSignerFactoryContract, safeWebAuthnSharedSignerContract, safeProvider.getExternalProvider(), safeAddress || '', owners || [], chainId.toString());
            }
            else {
                // signer was already initialized and we pass a PasskeySigner instance (reconnecting)
                passkeySigner = signer;
            }
            return new SafeProvider({
                provider,
                signer: passkeySigner
            });
        }
        else {
            return new SafeProvider({
                provider,
                signer
            });
        }
    }
    async getExternalSigner() {
        if (typeof this.signer === 'string') {
            // If the signer is not an Ethereum address, it should be a private key
            if (!ethers_1.ethers.isAddress(this.signer)) {
                const privateKeySigner = new ethers_1.ethers.Wallet(this.signer, __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f"));
                return privateKeySigner;
            }
            return __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f").getSigner(this.signer);
        }
        else {
            if (this.signer) {
                return this.signer;
            }
        }
        if (__classPrivateFieldGet(this, _SafeProvider_externalProvider, "f") instanceof ethers_1.BrowserProvider) {
            return __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f").getSigner();
        }
        return undefined;
    }
    async isPasskeySigner() {
        const signer = (await this.getExternalSigner());
        return signer && !!signer.passkeyRawId;
    }
    isAddress(address) {
        return ethers_1.ethers.isAddress(address);
    }
    async getEip3770Address(fullAddress) {
        const chainId = await this.getChainId();
        return (0, utils_1.validateEip3770Address)(fullAddress, chainId);
    }
    async getBalance(address, blockTag) {
        return __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f").getBalance(address, blockTag);
    }
    async getNonce(address, blockTag) {
        return __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f").getTransactionCount(address, blockTag);
    }
    async getChainId() {
        return (await __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f").getNetwork()).chainId;
    }
    getChecksummedAddress(address) {
        return ethers_1.ethers.getAddress(address);
    }
    async getSafeContract({ safeVersion, customContractAddress, customContractAbi, isL1SafeSingleton }) {
        return (0, contractInstances_1.getSafeContractInstance)(safeVersion, this, customContractAddress, customContractAbi, isL1SafeSingleton);
    }
    async getSafeProxyFactoryContract({ safeVersion, customContractAddress, customContractAbi }) {
        const signerOrProvider = (await this.getExternalSigner()) || __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f");
        return (0, contractInstances_1.getSafeProxyFactoryContractInstance)(safeVersion, this, signerOrProvider, customContractAddress, customContractAbi);
    }
    async getMultiSendContract({ safeVersion, customContractAddress, customContractAbi }) {
        return (0, contractInstances_1.getMultiSendContractInstance)(safeVersion, this, customContractAddress, customContractAbi);
    }
    async getMultiSendCallOnlyContract({ safeVersion, customContractAddress, customContractAbi }) {
        return (0, contractInstances_1.getMultiSendCallOnlyContractInstance)(safeVersion, this, customContractAddress, customContractAbi);
    }
    async getCompatibilityFallbackHandlerContract({ safeVersion, customContractAddress, customContractAbi }) {
        return (0, contractInstances_1.getCompatibilityFallbackHandlerContractInstance)(safeVersion, this, customContractAddress, customContractAbi);
    }
    async getSignMessageLibContract({ safeVersion, customContractAddress, customContractAbi }) {
        return (0, contractInstances_1.getSignMessageLibContractInstance)(safeVersion, this, customContractAddress, customContractAbi);
    }
    async getCreateCallContract({ safeVersion, customContractAddress, customContractAbi }) {
        return (0, contractInstances_1.getCreateCallContractInstance)(safeVersion, this, customContractAddress, customContractAbi);
    }
    async getSimulateTxAccessorContract({ safeVersion, customContractAddress, customContractAbi }) {
        return (0, contractInstances_1.getSimulateTxAccessorContractInstance)(safeVersion, this, customContractAddress, customContractAbi);
    }
    async getSafeWebAuthnSignerFactoryContract({ safeVersion, customContractAddress, customContractAbi }) {
        return (0, contractInstances_1.getSafeWebAuthnSignerFactoryContractInstance)(safeVersion, this, customContractAddress, customContractAbi);
    }
    async getSafeWebAuthnSharedSignerContract({ safeVersion, customContractAddress, customContractAbi }) {
        return (0, contractInstances_1.getSafeWebAuthnSharedSignerContractInstance)(safeVersion, this, customContractAddress, customContractAbi);
    }
    async getContractCode(address, blockTag) {
        return __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f").getCode(address, blockTag);
    }
    async isContractDeployed(address, blockTag) {
        const contractCode = await __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f").getCode(address, blockTag);
        return contractCode !== constants_1.EMPTY_DATA;
    }
    async getStorageAt(address, position) {
        const content = await __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f").getStorage(address, position);
        const decodedContent = this.decodeParameters(['address'], content);
        return decodedContent[0];
    }
    async getTransaction(transactionHash) {
        return __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f").getTransaction(transactionHash);
    }
    async getSignerAddress() {
        const signer = await this.getExternalSigner();
        return signer?.getAddress();
    }
    async signMessage(message) {
        const signer = await this.getExternalSigner();
        if (!signer) {
            throw new Error('SafeProvider must be initialized with a signer to use this method');
        }
        const messageArray = ethers_1.ethers.getBytes(message);
        return signer.signMessage(messageArray);
    }
    async signTypedData(safeEIP712Args) {
        const signer = await this.getExternalSigner();
        if (!signer) {
            throw new Error('SafeProvider must be initialized with a signer to use this method');
        }
        if ((0, utils_2.isTypedDataSigner)(signer)) {
            const typedData = (0, utils_1.generateTypedData)(safeEIP712Args);
            const signature = await signer.signTypedData(typedData.domain, typedData.primaryType === 'SafeMessage'
                ? { SafeMessage: typedData.types.SafeMessage }
                : { SafeTx: typedData.types.SafeTx }, typedData.message);
            return signature;
        }
        throw new Error('The current signer does not implement EIP-712 to sign typed data');
    }
    async estimateGas(transaction) {
        return (await __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f").estimateGas(transaction)).toString();
    }
    call(transaction, blockTag) {
        return __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f").call({ ...transaction, blockTag });
    }
    // TODO: fix anys
    encodeParameters(types, values) {
        return new ethers_1.ethers.AbiCoder().encode(types, values);
    }
    decodeParameters(types, values) {
        return new ethers_1.ethers.AbiCoder().decode(types, values);
    }
}
_SafeProvider_externalProvider = new WeakMap();
exports.default = SafeProvider;
//# sourceMappingURL=SafeProvider.js.map