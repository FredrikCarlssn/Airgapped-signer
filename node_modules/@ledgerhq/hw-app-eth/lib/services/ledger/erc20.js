"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.byContractAddressAndChainId = exports.findERC20SignaturesInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const logs_1 = require("@ledgerhq/logs");
const index_1 = require("@ledgerhq/cryptoassets/data/evm/index");
const loadConfig_1 = require("./loadConfig");
const asContractAddress = (addr) => {
    const a = addr.toLowerCase();
    return a.startsWith("0x") ? a : "0x" + a;
};
const findERC20SignaturesInfo = (userLoadConfig, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const { cryptoassetsBaseURL } = (0, loadConfig_1.getLoadConfig)(userLoadConfig);
    if (!cryptoassetsBaseURL)
        return null;
    const url = `${cryptoassetsBaseURL}/evm/${chainId}/erc20-signatures.json`;
    const blob = yield axios_1.default
        .get(url)
        .then(({ data }) => {
        if (!data || typeof data !== "string") {
            throw new Error(`ERC20 signatures for chainId ${chainId} file is malformed ${url}`);
        }
        return data;
    })
        .catch(e => {
        (0, logs_1.log)("error", "could not fetch from " + url + ": " + String(e));
        return null;
    });
    return blob;
});
exports.findERC20SignaturesInfo = findERC20SignaturesInfo;
/**
 * Retrieve the token information by a given contract address if any
 */
const byContractAddressAndChainId = (contract, chainId, erc20SignaturesBlob) => {
    var _a, _b;
    // If we are able to fetch data from s3 bucket that contains dynamic CAL
    if (erc20SignaturesBlob) {
        try {
            return parse(erc20SignaturesBlob).byContractAndChainId(asContractAddress(contract), chainId);
        }
        catch (e) {
            return (_a = get(chainId)) === null || _a === void 0 ? void 0 : _a.byContractAndChainId(asContractAddress(contract), chainId);
        }
    }
    // the static fallback when dynamic cal is not provided
    return (_b = get(chainId)) === null || _b === void 0 ? void 0 : _b.byContractAndChainId(asContractAddress(contract), chainId);
};
exports.byContractAddressAndChainId = byContractAddressAndChainId;
const parse = (erc20SignaturesBlob) => {
    const buf = Buffer.from(erc20SignaturesBlob, "base64");
    const map = {};
    const entries = [];
    let i = 0;
    while (i < buf.length) {
        const length = buf.readUInt32BE(i);
        i += 4;
        const item = buf.slice(i, i + length);
        let j = 0;
        const tickerLength = item.readUInt8(j);
        j += 1;
        const ticker = item.slice(j, j + tickerLength).toString("ascii");
        j += tickerLength;
        const contractAddress = asContractAddress(item.slice(j, j + 20).toString("hex"));
        j += 20;
        const decimals = item.readUInt32BE(j);
        j += 4;
        const chainId = item.readUInt32BE(j);
        j += 4;
        const signature = item.slice(j);
        const entry = {
            ticker,
            contractAddress,
            decimals,
            chainId,
            signature,
            data: item,
        };
        entries.push(entry);
        map[String(chainId) + ":" + contractAddress] = entry;
        i += length;
    }
    return {
        list: () => entries,
        byContractAndChainId: (contractAddress, chainId) => map[String(chainId) + ":" + contractAddress],
    };
};
// this internal get() will lazy load and cache the data from the erc20 data blob
const get = (() => {
    const cache = {};
    return chainId => {
        if (cache[chainId])
            return cache[chainId];
        const signatureBlob = index_1.signatures[chainId];
        if (!signatureBlob)
            return null;
        const api = parse(signatureBlob);
        cache[chainId] = api;
        return api;
    };
})();
//# sourceMappingURL=erc20.js.map