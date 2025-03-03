var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import { getLoadConfig } from "./loadConfig";
import { log } from "@ledgerhq/logs";
export const getNFTInfo = (contractAddress, chainId, userLoadConfig) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { nftExplorerBaseURL } = getLoadConfig(userLoadConfig);
    if (!nftExplorerBaseURL)
        return;
    const url = `${nftExplorerBaseURL}/${chainId}/contracts/${contractAddress}`;
    const response = yield axios
        .get(url)
        .then(r => r.data)
        .catch(e => {
        log("error", "could not fetch from " + url + ": " + String(e));
        return null;
    });
    if (!response)
        return;
    // APDU response specification: https://ledgerhq.atlassian.net/wiki/spaces/WALLETCO/pages/3269984297/NFT-1+NFT+Backend+design#NFT-Metadata-BLOB
    const payload = response["payload"];
    // Collection name length position: 3rd byte -> caracter 4 to 6
    const collectionNameLength = parseInt(payload.slice(4, 6), 16);
    const collectionNameHex = payload.substr(6, collectionNameLength * 2);
    const collectionName = (_a = collectionNameHex
        .match(/.{2}/g) // split every 2 characters
    ) === null || _a === void 0 ? void 0 : _a.reduce((acc, curr) => (acc += String.fromCharCode(parseInt(curr, 16))), ""); // convert hex to string
    return {
        contractAddress: contractAddress,
        collectionName: collectionName || "",
        data: payload,
    };
});
export const loadNftPlugin = (contractAddress, selector, chainId, userLoadConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const { nftExplorerBaseURL } = getLoadConfig(userLoadConfig);
    if (!nftExplorerBaseURL)
        return;
    const url = `${nftExplorerBaseURL}/${chainId}/contracts/${contractAddress}/plugin-selector/${selector}`;
    const response = yield axios
        .get(url)
        .then(r => r.data)
        .catch(e => {
        log("error", "could not fetch from " + url + ": " + String(e));
        return null;
    });
    if (!response)
        return;
    const payload = response["payload"];
    return payload;
});
//# sourceMappingURL=nfts.js.map