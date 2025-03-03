"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _SafeFactory_instances, _SafeFactory_contractNetworks, _SafeFactory_isL1SafeSingleton, _SafeFactory_safeVersion, _SafeFactory_safeProxyFactoryContract, _SafeFactory_safeContract, _SafeFactory_provider, _SafeFactory_signer, _SafeFactory_safeProvider, _SafeFactory_initializeSafeFactory;
Object.defineProperty(exports, "__esModule", { value: true });
const Safe_1 = __importDefault(require("./Safe"));
const config_1 = require("./contracts/config");
const safeDeploymentContracts_1 = require("./contracts/safeDeploymentContracts");
const utils_1 = require("./contracts/utils");
const SafeProvider_1 = __importDefault(require("./SafeProvider"));
class SafeFactory {
    constructor() {
        _SafeFactory_instances.add(this);
        _SafeFactory_contractNetworks.set(this, void 0);
        _SafeFactory_isL1SafeSingleton.set(this, void 0);
        _SafeFactory_safeVersion.set(this, void 0);
        _SafeFactory_safeProxyFactoryContract.set(this, void 0);
        _SafeFactory_safeContract.set(this, void 0);
        _SafeFactory_provider.set(this, void 0);
        _SafeFactory_signer.set(this, void 0);
        _SafeFactory_safeProvider.set(this, void 0);
    }
    static async init({ provider, signer, safeVersion = config_1.DEFAULT_SAFE_VERSION, isL1SafeSingleton = false, contractNetworks }) {
        const safeFactorySdk = new SafeFactory();
        await __classPrivateFieldGet(safeFactorySdk, _SafeFactory_instances, "m", _SafeFactory_initializeSafeFactory).call(safeFactorySdk, {
            provider,
            signer,
            safeVersion,
            isL1SafeSingleton,
            contractNetworks
        });
        return safeFactorySdk;
    }
    getSafeProvider() {
        return __classPrivateFieldGet(this, _SafeFactory_safeProvider, "f");
    }
    getSafeVersion() {
        return __classPrivateFieldGet(this, _SafeFactory_safeVersion, "f");
    }
    getAddress() {
        return __classPrivateFieldGet(this, _SafeFactory_safeProxyFactoryContract, "f").getAddress();
    }
    async getChainId() {
        return __classPrivateFieldGet(this, _SafeFactory_safeProvider, "f").getChainId();
    }
    async predictSafeAddress(safeAccountConfig, saltNonce) {
        const chainId = await __classPrivateFieldGet(this, _SafeFactory_safeProvider, "f").getChainId();
        const customContracts = __classPrivateFieldGet(this, _SafeFactory_contractNetworks, "f")?.[chainId.toString()];
        const safeVersion = __classPrivateFieldGet(this, _SafeFactory_safeVersion, "f");
        const safeDeploymentConfig = {
            saltNonce: saltNonce || (0, utils_1.getChainSpecificDefaultSaltNonce)(chainId),
            safeVersion
        };
        return (0, utils_1.predictSafeAddress)({
            safeProvider: __classPrivateFieldGet(this, _SafeFactory_safeProvider, "f"),
            chainId,
            safeAccountConfig,
            safeDeploymentConfig,
            isL1SafeSingleton: __classPrivateFieldGet(this, _SafeFactory_isL1SafeSingleton, "f"),
            customContracts
        });
    }
    async deploySafe({ safeAccountConfig, saltNonce, options, callback }) {
        (0, utils_1.validateSafeAccountConfig)(safeAccountConfig);
        (0, utils_1.validateSafeDeploymentConfig)({ saltNonce });
        const signerAddress = await __classPrivateFieldGet(this, _SafeFactory_safeProvider, "f").getSignerAddress();
        if (!signerAddress) {
            throw new Error('SafeProvider must be initialized with a signer to use this method');
        }
        const chainId = await this.getChainId();
        const customContracts = __classPrivateFieldGet(this, _SafeFactory_contractNetworks, "f")?.[chainId.toString()];
        const initializer = await (0, utils_1.encodeSetupCallData)({
            safeProvider: __classPrivateFieldGet(this, _SafeFactory_safeProvider, "f"),
            safeAccountConfig,
            safeContract: __classPrivateFieldGet(this, _SafeFactory_safeContract, "f"),
            customContracts
        });
        const safeAddress = await __classPrivateFieldGet(this, _SafeFactory_safeProxyFactoryContract, "f").createProxyWithOptions({
            safeSingletonAddress: await __classPrivateFieldGet(this, _SafeFactory_safeContract, "f").getAddress(),
            initializer,
            saltNonce: saltNonce || (0, utils_1.getChainSpecificDefaultSaltNonce)(chainId),
            options: {
                from: signerAddress,
                ...options
            },
            callback
        });
        const isContractDeployed = await __classPrivateFieldGet(this, _SafeFactory_safeProvider, "f").isContractDeployed(safeAddress);
        if (!isContractDeployed) {
            throw new Error('SafeProxy contract is not deployed on the current network');
        }
        const safe = await Safe_1.default.init({
            provider: __classPrivateFieldGet(this, _SafeFactory_provider, "f"),
            signer: __classPrivateFieldGet(this, _SafeFactory_signer, "f"),
            safeAddress,
            isL1SafeSingleton: __classPrivateFieldGet(this, _SafeFactory_isL1SafeSingleton, "f"),
            contractNetworks: __classPrivateFieldGet(this, _SafeFactory_contractNetworks, "f")
        });
        return safe;
    }
}
_SafeFactory_contractNetworks = new WeakMap(), _SafeFactory_isL1SafeSingleton = new WeakMap(), _SafeFactory_safeVersion = new WeakMap(), _SafeFactory_safeProxyFactoryContract = new WeakMap(), _SafeFactory_safeContract = new WeakMap(), _SafeFactory_provider = new WeakMap(), _SafeFactory_signer = new WeakMap(), _SafeFactory_safeProvider = new WeakMap(), _SafeFactory_instances = new WeakSet(), _SafeFactory_initializeSafeFactory = async function _SafeFactory_initializeSafeFactory({ provider, signer, safeVersion, isL1SafeSingleton, contractNetworks }) {
    __classPrivateFieldSet(this, _SafeFactory_provider, provider, "f");
    __classPrivateFieldSet(this, _SafeFactory_signer, signer, "f");
    __classPrivateFieldSet(this, _SafeFactory_safeProvider, await SafeProvider_1.default.init(provider, signer, safeVersion, contractNetworks), "f");
    __classPrivateFieldSet(this, _SafeFactory_safeVersion, safeVersion, "f");
    __classPrivateFieldSet(this, _SafeFactory_isL1SafeSingleton, isL1SafeSingleton, "f");
    __classPrivateFieldSet(this, _SafeFactory_contractNetworks, contractNetworks, "f");
    const chainId = await __classPrivateFieldGet(this, _SafeFactory_safeProvider, "f").getChainId();
    const customContracts = contractNetworks?.[chainId.toString()];
    __classPrivateFieldSet(this, _SafeFactory_safeProxyFactoryContract, await (0, safeDeploymentContracts_1.getProxyFactoryContract)({
        safeProvider: __classPrivateFieldGet(this, _SafeFactory_safeProvider, "f"),
        safeVersion,
        customContracts
    }), "f");
    __classPrivateFieldSet(this, _SafeFactory_safeContract, await (0, safeDeploymentContracts_1.getSafeContract)({
        safeProvider: __classPrivateFieldGet(this, _SafeFactory_safeProvider, "f"),
        safeVersion,
        isL1SafeSingleton,
        customContracts
    }), "f");
};
exports.default = SafeFactory;
//# sourceMappingURL=SafeFactory.js.map