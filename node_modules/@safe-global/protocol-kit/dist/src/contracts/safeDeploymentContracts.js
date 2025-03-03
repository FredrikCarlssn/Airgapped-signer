"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafeWebAuthnSharedSignerContract = exports.getSafeWebAuthnSignerFactoryContract = exports.getSimulateTxAccessorContract = exports.getCreateCallContract = exports.getSignMessageLibContract = exports.getMultiSendCallOnlyContract = exports.getMultiSendContract = exports.getCompatibilityFallbackHandlerContract = exports.getProxyFactoryContract = exports.getSafeContract = void 0;
async function getSafeContract({ safeProvider, safeVersion, customSafeAddress, isL1SafeSingleton, customContracts }) {
    const safeContract = await safeProvider.getSafeContract({
        safeVersion,
        customContractAddress: customSafeAddress ?? customContracts?.safeSingletonAddress,
        customContractAbi: customContracts?.safeSingletonAbi,
        isL1SafeSingleton
    });
    const isContractDeployed = await safeProvider.isContractDeployed(await safeContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('SafeProxy contract is not deployed on the current network');
    }
    return safeContract;
}
exports.getSafeContract = getSafeContract;
async function getProxyFactoryContract({ safeProvider, safeVersion, customContracts }) {
    const safeProxyFactoryContract = await safeProvider.getSafeProxyFactoryContract({
        safeVersion,
        customContractAddress: customContracts?.safeProxyFactoryAddress,
        customContractAbi: customContracts?.safeProxyFactoryAbi
    });
    const isContractDeployed = await safeProvider.isContractDeployed(await safeProxyFactoryContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('SafeProxyFactory contract is not deployed on the current network');
    }
    return safeProxyFactoryContract;
}
exports.getProxyFactoryContract = getProxyFactoryContract;
async function getCompatibilityFallbackHandlerContract({ safeProvider, safeVersion, customContracts }) {
    const fallbackHandlerContract = await safeProvider.getCompatibilityFallbackHandlerContract({
        safeVersion,
        customContractAddress: customContracts?.fallbackHandlerAddress,
        customContractAbi: customContracts?.fallbackHandlerAbi
    });
    const isContractDeployed = await safeProvider.isContractDeployed(await fallbackHandlerContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('CompatibilityFallbackHandler contract is not deployed on the current network');
    }
    return fallbackHandlerContract;
}
exports.getCompatibilityFallbackHandlerContract = getCompatibilityFallbackHandlerContract;
async function getMultiSendContract({ safeProvider, safeVersion, customContracts }) {
    const multiSendContract = await safeProvider.getMultiSendContract({
        safeVersion,
        customContractAddress: customContracts?.multiSendAddress,
        customContractAbi: customContracts?.multiSendAbi
    });
    const isContractDeployed = await safeProvider.isContractDeployed(await multiSendContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('MultiSend contract is not deployed on the current network');
    }
    return multiSendContract;
}
exports.getMultiSendContract = getMultiSendContract;
async function getMultiSendCallOnlyContract({ safeProvider, safeVersion, customContracts }) {
    const multiSendCallOnlyContract = await safeProvider.getMultiSendCallOnlyContract({
        safeVersion,
        customContractAddress: customContracts?.multiSendCallOnlyAddress,
        customContractAbi: customContracts?.multiSendCallOnlyAbi
    });
    const isContractDeployed = await safeProvider.isContractDeployed(await multiSendCallOnlyContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('MultiSendCallOnly contract is not deployed on the current network');
    }
    return multiSendCallOnlyContract;
}
exports.getMultiSendCallOnlyContract = getMultiSendCallOnlyContract;
async function getSignMessageLibContract({ safeProvider, safeVersion, customContracts }) {
    const signMessageLibContract = await safeProvider.getSignMessageLibContract({
        safeVersion,
        customContractAddress: customContracts?.signMessageLibAddress,
        customContractAbi: customContracts?.signMessageLibAbi
    });
    const isContractDeployed = await safeProvider.isContractDeployed(await signMessageLibContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('SignMessageLib contract is not deployed on the current network');
    }
    return signMessageLibContract;
}
exports.getSignMessageLibContract = getSignMessageLibContract;
async function getCreateCallContract({ safeProvider, safeVersion, customContracts }) {
    const createCallContract = await safeProvider.getCreateCallContract({
        safeVersion,
        customContractAddress: customContracts?.createCallAddress,
        customContractAbi: customContracts?.createCallAbi
    });
    const isContractDeployed = await safeProvider.isContractDeployed(await createCallContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('CreateCall contract is not deployed on the current network');
    }
    return createCallContract;
}
exports.getCreateCallContract = getCreateCallContract;
async function getSimulateTxAccessorContract({ safeProvider, safeVersion, customContracts }) {
    const simulateTxAccessorContract = await safeProvider.getSimulateTxAccessorContract({
        safeVersion,
        customContractAddress: customContracts?.simulateTxAccessorAddress,
        customContractAbi: customContracts?.simulateTxAccessorAbi
    });
    const isContractDeployed = await safeProvider.isContractDeployed(await simulateTxAccessorContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('SimulateTxAccessor contract is not deployed on the current network');
    }
    return simulateTxAccessorContract;
}
exports.getSimulateTxAccessorContract = getSimulateTxAccessorContract;
async function getSafeWebAuthnSignerFactoryContract({ safeProvider, safeVersion, customContracts }) {
    const safeWebAuthnSignerFactoryContract = await safeProvider.getSafeWebAuthnSignerFactoryContract({
        safeVersion,
        customContractAddress: customContracts?.safeWebAuthnSignerFactoryAddress,
        customContractAbi: customContracts?.safeWebAuthnSignerFactoryAbi
    });
    const isContractDeployed = await safeProvider.isContractDeployed(await safeWebAuthnSignerFactoryContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('safeWebAuthnSignerFactory contract is not deployed on the current network');
    }
    return safeWebAuthnSignerFactoryContract;
}
exports.getSafeWebAuthnSignerFactoryContract = getSafeWebAuthnSignerFactoryContract;
async function getSafeWebAuthnSharedSignerContract({ safeProvider, safeVersion, customContracts }) {
    const safeWebAuthnSharedSignerContract = await safeProvider.getSafeWebAuthnSharedSignerContract({
        safeVersion,
        customContractAddress: customContracts?.safeWebAuthnSharedSignerAddress,
        customContractAbi: customContracts?.safeWebAuthnSharedSignerAbi
    });
    const isContractDeployed = await safeProvider.isContractDeployed(await safeWebAuthnSharedSignerContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('safeWebAuthnSharedSigner contract is not deployed on the current network');
    }
    return safeWebAuthnSharedSignerContract;
}
exports.getSafeWebAuthnSharedSignerContract = getSafeWebAuthnSharedSignerContract;
//# sourceMappingURL=safeDeploymentContracts.js.map