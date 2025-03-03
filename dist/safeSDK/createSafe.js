"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const protocol_kit_1 = require("@safe-global/protocol-kit");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function createSafe() {
    try {
        // // Connect to Ledger
        // console.log("Attempting to connect to Ledger...");
        // const transport = await TransportNodeHid.create();
        // console.log("Transport created successfully");
        // const eth = new Eth(transport);
        // console.log("Eth instance created successfully");
        // Get the Ethereum address from Ledger
        // console.log("Attempting to get Ethereum address...");
        // const { address } = await eth.getAddress("44'/60'/0'/0/0");
        // console.log("Ledger Ethereum Address:", address);
        const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/gOkybg94zSnQrjv5LUc7LFdyrOhzDOhC";
        const provider = new ethers_1.ethers.JsonRpcProvider(RPC_URL);
        // const signer: LedgerSigner = new LedgerSigner(transport, provider, "44'/60'/0'/0/0");
        const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
        const ADDRESS = "0xc9c81Af14eC5d7a4Ca19fdC9897054e2d033bf05";
        // Initialize SafeFactory with the signer
        const safeFactory = await protocol_kit_1.SafeFactory.init({
            provider: RPC_URL,
            signer: PRIVATE_KEY,
        });
        // Create Safe
        const safeAccountConfig = {
            owners: [ADDRESS],
            threshold: 1,
        };
        console.log("Deploying Safe...");
        const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
        const safeAddress = await safeSdk.getAddress();
        console.log("Your Safe has been deployed:");
        console.log(`https://etherscan.io/address/${safeAddress}`);
        console.log(`https://app.safe.global/eth:${safeAddress}`);
        // await transport.close();
    }
    catch (error) {
        console.error("Error in createSafe function:", error);
    }
}
createSafe().catch((error) => {
    console.error("Unhandled error in createSafe:", error);
});
