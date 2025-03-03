import { ethers } from "ethers";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import Eth from "@ledgerhq/hw-app-eth";
import { SafeFactory } from "@safe-global/protocol-kit";
import { LedgerSigner } from "@ethers-ext/signer-ledger";
import { SafeAccountConfig } from "@safe-global/protocol-kit";
import dotenv from 'dotenv';
dotenv.config();

async function createSafe(): Promise<void> {
  try {
        // Multisig = 0x0756847C08bbf1AbFF6F03245313E1503B6A820d
        // address_5 = 0xadE47C57ECb0AAe8E3012BF18932809D4422FA5c
        // address_6 = 0x2FaA5b7cCb8d3e04E7eA6308Fc0FE8daDC0560E1
        // address_7 = 0x839Ed92f933a059b142cC42d26c1D2cacC57E2db


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

    const RPC_URL: string =
      "https://eth-sepolia.g.alchemy.com/v2/gOkybg94zSnQrjv5LUc7LFdyrOhzDOhC";
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    // const signer: LedgerSigner = new LedgerSigner(transport, provider, "44'/60'/0'/0/0");
    const PRIVATE_KEY: string =
      process.env.PRIVATE_KEY || "";
    const address_5: string = "0xadE47C57ECb0AAe8E3012BF18932809D4422FA5c";
    const address_6: string = "0x2FaA5b7cCb8d3e04E7eA6308Fc0FE8daDC0560E1";
    const address_7: string = "0x839Ed92f933a059b142cC42d26c1D2cacC57E2db";

    // Initialize SafeFactory with the signer
    const safeFactory = await SafeFactory.init({
      provider: RPC_URL,
      signer: PRIVATE_KEY,
    });

    // Create Safe
    const safeAccountConfig: SafeAccountConfig = {
      owners: [ address_5, address_6, address_7 ],
      threshold: 2,
    };

    console.log("Deploying Safe...");
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });

    const safeAddress = await safeSdk.getAddress();

    console.log("Your Safe has been deployed:");
    console.log(`https://etherscan.io/address/${safeAddress}`);
    console.log(`https://app.safe.global/eth:${safeAddress}`);

    // await transport.close();
  } catch (error) {
    console.error("Error in createSafe function:", error);
  }
}

createSafe().catch((error: Error) => {
  console.error("Unhandled error in createSafe:", error);
});
