"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractDeployment = exports.safeDeploymentsL1ChainIds = exports.safeDeploymentsVersions = exports.SAFE_BASE_VERSION = exports.DEFAULT_SAFE_VERSION = void 0;
const safe_deployments_1 = require("@safe-global/safe-deployments");
const safe_modules_deployments_1 = require("@safe-global/safe-modules-deployments");
exports.DEFAULT_SAFE_VERSION = '1.3.0';
exports.SAFE_BASE_VERSION = '1.0.0';
exports.safeDeploymentsVersions = {
    '1.4.1': {
        safeSingletonVersion: '1.4.1',
        safeSingletonL2Version: '1.4.1',
        safeProxyFactoryVersion: '1.4.1',
        compatibilityFallbackHandler: '1.4.1',
        multiSendVersion: '1.4.1',
        multiSendCallOnlyVersion: '1.4.1',
        signMessageLibVersion: '1.4.1',
        createCallVersion: '1.4.1',
        simulateTxAccessorVersion: '1.4.1',
        safeWebAuthnSignerFactoryVersion: '0.2.1',
        safeWebAuthnSharedSignerVersion: '0.2.1'
    },
    '1.3.0': {
        safeSingletonVersion: '1.3.0',
        safeSingletonL2Version: '1.3.0',
        safeProxyFactoryVersion: '1.3.0',
        compatibilityFallbackHandler: '1.3.0',
        multiSendVersion: '1.3.0',
        multiSendCallOnlyVersion: '1.3.0',
        signMessageLibVersion: '1.3.0',
        createCallVersion: '1.3.0',
        simulateTxAccessorVersion: '1.3.0',
        safeWebAuthnSignerFactoryVersion: '0.2.1',
        safeWebAuthnSharedSignerVersion: '0.2.1'
    },
    '1.2.0': {
        safeSingletonVersion: '1.2.0',
        safeSingletonL2Version: undefined,
        safeProxyFactoryVersion: '1.1.1',
        compatibilityFallbackHandler: '1.3.0',
        multiSendVersion: '1.1.1',
        multiSendCallOnlyVersion: '1.3.0',
        signMessageLibVersion: '1.3.0',
        createCallVersion: '1.3.0',
        safeWebAuthnSignerFactoryVersion: '0.2.1',
        safeWebAuthnSharedSignerVersion: '0.2.1'
    },
    '1.1.1': {
        safeSingletonVersion: '1.1.1',
        safeSingletonL2Version: undefined,
        safeProxyFactoryVersion: '1.1.1',
        compatibilityFallbackHandler: '1.3.0',
        multiSendVersion: '1.1.1',
        multiSendCallOnlyVersion: '1.3.0',
        signMessageLibVersion: '1.3.0',
        createCallVersion: '1.3.0',
        safeWebAuthnSignerFactoryVersion: '0.2.1',
        safeWebAuthnSharedSignerVersion: '0.2.1'
    },
    '1.0.0': {
        safeSingletonVersion: '1.0.0',
        safeSingletonL2Version: undefined,
        safeProxyFactoryVersion: '1.0.0',
        compatibilityFallbackHandler: '1.3.0',
        multiSendVersion: '1.1.1',
        multiSendCallOnlyVersion: '1.3.0',
        signMessageLibVersion: '1.3.0',
        createCallVersion: '1.3.0',
        safeWebAuthnSignerFactoryVersion: '0.2.1',
        safeWebAuthnSharedSignerVersion: '0.2.1'
    }
};
exports.safeDeploymentsL1ChainIds = [
    1n // Ethereum Mainnet
];
const contractFunctions = {
    safeSingletonVersion: safe_deployments_1.getSafeSingletonDeployment,
    safeSingletonL2Version: safe_deployments_1.getSafeL2SingletonDeployment,
    safeProxyFactoryVersion: safe_deployments_1.getProxyFactoryDeployment,
    compatibilityFallbackHandler: safe_deployments_1.getCompatibilityFallbackHandlerDeployment,
    multiSendVersion: safe_deployments_1.getMultiSendDeployment,
    multiSendCallOnlyVersion: safe_deployments_1.getMultiSendCallOnlyDeployment,
    signMessageLibVersion: safe_deployments_1.getSignMessageLibDeployment,
    createCallVersion: safe_deployments_1.getCreateCallDeployment,
    simulateTxAccessorVersion: safe_deployments_1.getSimulateTxAccessorDeployment,
    safeWebAuthnSignerFactoryVersion: safe_modules_deployments_1.getSafeWebAuthnSignerFactoryDeployment,
    safeWebAuthnSharedSignerVersion: safe_modules_deployments_1.getSafeWebAuthnShareSignerDeployment
};
function getContractDeployment(safeVersion, chainId, contractName) {
    const contractVersion = exports.safeDeploymentsVersions[safeVersion][contractName];
    const filters = {
        version: contractVersion,
        network: chainId.toString(),
        released: true
    };
    const deployment = contractFunctions[contractName](filters);
    return deployment;
}
exports.getContractDeployment = getContractDeployment;
//# sourceMappingURL=config.js.map