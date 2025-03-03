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
exports.loadInfosForContractMethod = void 0;
const axios_1 = __importDefault(require("axios"));
const loadConfig_1 = require("./loadConfig");
const logs_1 = require("@ledgerhq/logs");
/**
 * Retrieve the metadatas a given contract address and a method selector
 */
const loadInfosForContractMethod = (contractAddress, selector, chainId, userLoadConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const { pluginBaseURL, extraPlugins } = (0, loadConfig_1.getLoadConfig)(userLoadConfig);
    let data = {};
    if (pluginBaseURL) {
        const url = `${pluginBaseURL}/plugins/ethereum.json`;
        data = yield axios_1.default
            .get(`${pluginBaseURL}/plugins/ethereum.json`)
            .then(r => r.data)
            .catch(e => {
            (0, logs_1.log)("error", "could not fetch from " + url + ": " + String(e));
            return null;
        });
    }
    if (extraPlugins) {
        data = Object.assign(Object.assign({}, data), extraPlugins);
    }
    if (!data)
        return;
    const lcSelector = selector.toLowerCase();
    const lcContractAddress = contractAddress.toLowerCase();
    if (lcContractAddress in data) {
        const contractSelectors = data[lcContractAddress];
        if (lcSelector in contractSelectors) {
            return {
                payload: contractSelectors[lcSelector]["serialized_data"],
                signature: contractSelectors[lcSelector]["signature"],
                plugin: contractSelectors[lcSelector]["plugin"],
                erc20OfInterest: contractSelectors[lcSelector]["erc20OfInterest"],
                abi: contractSelectors["abi"],
            };
        }
    }
});
exports.loadInfosForContractMethod = loadInfosForContractMethod;
//# sourceMappingURL=contracts.js.map