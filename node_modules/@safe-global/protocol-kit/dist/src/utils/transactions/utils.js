"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNewOwnerPasskey = exports.isOldOwnerPasskey = exports.isPasskeyParam = exports.isSafeMultisigTransactionResponse = exports.decodeMultiSendData = exports.encodeMultiSendData = exports.standardizeSafeTransactionData = exports.standardizeMetaTransactionData = void 0;
const ethers_1 = require("ethers");
const SafeProvider_1 = __importDefault(require("../../SafeProvider"));
const config_1 = require("../../contracts/config");
const utils_1 = require("../../utils");
const constants_1 = require("../../utils/constants");
const safe_core_sdk_types_1 = require("@safe-global/safe-core-sdk-types");
const satisfies_1 = __importDefault(require("semver/functions/satisfies"));
const gas_1 = require("./gas");
function standardizeMetaTransactionData(tx) {
    const standardizedTxs = {
        ...tx,
        operation: tx.operation ?? safe_core_sdk_types_1.OperationType.Call
    };
    return standardizedTxs;
}
exports.standardizeMetaTransactionData = standardizeMetaTransactionData;
async function standardizeSafeTransactionData({ safeContract, predictedSafe, provider, tx, contractNetworks }) {
    const standardizedTxs = {
        to: tx.to,
        value: tx.value,
        data: tx.data,
        operation: tx.operation ?? safe_core_sdk_types_1.OperationType.Call,
        baseGas: tx.baseGas ?? '0',
        gasPrice: tx.gasPrice ?? '0',
        gasToken: tx.gasToken || constants_1.ZERO_ADDRESS,
        refundReceiver: tx.refundReceiver || constants_1.ZERO_ADDRESS,
        nonce: tx.nonce ?? (safeContract ? Number(await safeContract.getNonce()) : 0)
    };
    if (typeof tx.safeTxGas !== 'undefined') {
        return {
            ...standardizedTxs,
            safeTxGas: tx.safeTxGas
        };
    }
    let safeVersion;
    if (predictedSafe) {
        safeVersion = predictedSafe?.safeDeploymentConfig?.safeVersion || config_1.DEFAULT_SAFE_VERSION;
    }
    else {
        if (!safeContract) {
            throw new Error('Safe is not deployed');
        }
        safeVersion = await safeContract.getVersion();
    }
    const hasSafeTxGasOptional = (0, utils_1.hasSafeFeature)(utils_1.SAFE_FEATURES.SAFE_TX_GAS_OPTIONAL, safeVersion);
    if ((hasSafeTxGasOptional && standardizedTxs.gasPrice === '0') ||
        (hasSafeTxGasOptional && predictedSafe)) {
        return {
            ...standardizedTxs,
            safeTxGas: '0'
        };
    }
    if (!safeContract) {
        throw new Error('Safe is not deployed');
    }
    let safeTxGas;
    const safeProvider = new SafeProvider_1.default({ provider });
    if ((0, satisfies_1.default)(safeVersion, '>=1.3.0')) {
        safeTxGas = await (0, gas_1.estimateGas)(safeVersion, safeContract, safeProvider, standardizedTxs.to, standardizedTxs.value, standardizedTxs.data, standardizedTxs.operation, contractNetworks);
    }
    else {
        safeTxGas = await (0, gas_1.estimateTxGas)(safeContract, safeProvider, standardizedTxs.to, standardizedTxs.value, standardizedTxs.data, standardizedTxs.operation);
    }
    return {
        ...standardizedTxs,
        safeTxGas
    };
}
exports.standardizeSafeTransactionData = standardizeSafeTransactionData;
function encodeMetaTransaction(tx) {
    const data = (0, ethers_1.getBytes)(tx.data);
    const encoded = (0, ethers_1.solidityPacked)(['uint8', 'address', 'uint256', 'uint256', 'bytes'], [tx.operation, tx.to, tx.value, data.length, data]);
    return encoded.slice(2);
}
function encodeMultiSendData(txs) {
    return '0x' + txs.map((tx) => encodeMetaTransaction(tx)).join('');
}
exports.encodeMultiSendData = encodeMultiSendData;
function decodeMultiSendData(encodedData) {
    const multiSendInterface = new ethers_1.Interface([
        'function multiSend(bytes memory transactions) public payable'
    ]);
    const [decodedData] = multiSendInterface.decodeFunctionData('multiSend', encodedData);
    const txs = [];
    // Decode after 0x
    let index = 2;
    while (index < decodedData.length) {
        // As we are decoding hex encoded bytes calldata, each byte is represented by 2 chars
        // uint8 operation, address to, value uint256, dataLength uint256
        const operation = `0x${decodedData.slice(index, (index += 2))}`;
        const to = `0x${decodedData.slice(index, (index += 40))}`;
        const value = `0x${decodedData.slice(index, (index += 64))}`;
        const dataLength = parseInt(decodedData.slice(index, (index += 64)), 16) * 2;
        const data = `0x${decodedData.slice(index, (index += dataLength))}`;
        txs.push({
            operation: Number(operation),
            to: ethers_1.ethers.getAddress(to),
            value: BigInt(value).toString(),
            data
        });
    }
    return txs;
}
exports.decodeMultiSendData = decodeMultiSendData;
function isSafeMultisigTransactionResponse(safeTransaction) {
    return safeTransaction.isExecuted !== undefined;
}
exports.isSafeMultisigTransactionResponse = isSafeMultisigTransactionResponse;
function isPasskeyParam(params) {
    return params.passkey !== undefined;
}
exports.isPasskeyParam = isPasskeyParam;
function isOldOwnerPasskey(params) {
    return params.oldOwnerPasskey !== undefined;
}
exports.isOldOwnerPasskey = isOldOwnerPasskey;
function isNewOwnerPasskey(params) {
    return params.newOwnerPasskey !== undefined;
}
exports.isNewOwnerPasskey = isNewOwnerPasskey;
//# sourceMappingURL=utils.js.map