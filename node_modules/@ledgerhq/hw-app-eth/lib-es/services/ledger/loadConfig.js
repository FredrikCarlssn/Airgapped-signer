const defaultLoadConfig = {
    nftExplorerBaseURL: "https://nft.api.live.ledger.com/v1/ethereum",
    pluginBaseURL: "https://cdn.live.ledger.com",
    extraPlugins: null,
    cryptoassetsBaseURL: "https://cdn.live.ledger.com/cryptoassets",
    calServiceURL: "https://crypto-assets-service.api.ledger.com",
};
export function getLoadConfig(userLoadConfig) {
    return Object.assign(Object.assign({}, defaultLoadConfig), userLoadConfig);
}
//# sourceMappingURL=loadConfig.js.map