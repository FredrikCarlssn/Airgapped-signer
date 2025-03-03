"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypedData = exports.hashSafeMessage = exports.hashTypedData = exports.getEip712MessageTypes = exports.getEip712TxTypes = exports.EIP712_DOMAIN = exports.EIP712_DOMAIN_BEFORE_V130 = void 0;
const ethers_1 = require("ethers");
const satisfies_1 = __importDefault(require("semver/functions/satisfies"));
const EQ_OR_GT_1_3_0 = '>=1.3.0';
exports.EIP712_DOMAIN_BEFORE_V130 = [
    {
        type: 'address',
        name: 'verifyingContract'
    }
];
exports.EIP712_DOMAIN = [
    {
        type: 'uint256',
        name: 'chainId'
    },
    {
        type: 'address',
        name: 'verifyingContract'
    }
];
// This function returns the types structure for signing off-chain messages according to EIP-712
function getEip712TxTypes(safeVersion) {
    const eip712WithChainId = (0, satisfies_1.default)(safeVersion, EQ_OR_GT_1_3_0);
    return {
        EIP712Domain: eip712WithChainId ? exports.EIP712_DOMAIN : exports.EIP712_DOMAIN_BEFORE_V130,
        SafeTx: [
            { type: 'address', name: 'to' },
            { type: 'uint256', name: 'value' },
            { type: 'bytes', name: 'data' },
            { type: 'uint8', name: 'operation' },
            { type: 'uint256', name: 'safeTxGas' },
            { type: 'uint256', name: 'baseGas' },
            { type: 'uint256', name: 'gasPrice' },
            { type: 'address', name: 'gasToken' },
            { type: 'address', name: 'refundReceiver' },
            { type: 'uint256', name: 'nonce' }
        ]
    };
}
exports.getEip712TxTypes = getEip712TxTypes;
function getEip712MessageTypes(safeVersion) {
    const eip712WithChainId = (0, satisfies_1.default)(safeVersion, EQ_OR_GT_1_3_0);
    return {
        EIP712Domain: eip712WithChainId ? exports.EIP712_DOMAIN : exports.EIP712_DOMAIN_BEFORE_V130,
        SafeMessage: [{ type: 'bytes', name: 'message' }]
    };
}
exports.getEip712MessageTypes = getEip712MessageTypes;
const hashTypedData = (typedData) => {
    // `ethers` doesn't require `EIP712Domain` and otherwise throws
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { EIP712Domain: _, ...types } = typedData.types;
    return ethers_1.ethers.TypedDataEncoder.hash(typedData.domain, types, typedData.message);
};
exports.hashTypedData = hashTypedData;
const hashMessage = (message) => {
    return ethers_1.ethers.hashMessage(message);
};
const hashSafeMessage = (message) => {
    return typeof message === 'string' ? hashMessage(message) : (0, exports.hashTypedData)(message);
};
exports.hashSafeMessage = hashSafeMessage;
function generateTypedData({ safeAddress, safeVersion, chainId, data }) {
    const isSafeTransactionDataType = data.hasOwnProperty('to');
    const eip712WithChainId = (0, satisfies_1.default)(safeVersion, EQ_OR_GT_1_3_0);
    let typedData;
    if (isSafeTransactionDataType) {
        const txData = data;
        typedData = {
            types: getEip712TxTypes(safeVersion),
            domain: {
                verifyingContract: safeAddress
            },
            primaryType: 'SafeTx',
            message: {
                ...txData,
                value: txData.value,
                safeTxGas: txData.safeTxGas,
                baseGas: txData.baseGas,
                gasPrice: txData.gasPrice,
                nonce: txData.nonce
            }
        };
    }
    else {
        const message = data;
        typedData = {
            types: getEip712MessageTypes(safeVersion),
            domain: {
                verifyingContract: safeAddress
            },
            primaryType: 'SafeMessage',
            message: { message: (0, exports.hashSafeMessage)(message) }
        };
    }
    if (eip712WithChainId) {
        typedData.domain.chainId = chainId.toString();
    }
    return typedData;
}
exports.generateTypedData = generateTypedData;
//# sourceMappingURL=index.js.map