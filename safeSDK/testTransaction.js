const { ethers } = require("ethers");
const qrcode = require("qrcode-terminal");
const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
const Eth = require("@ledgerhq/hw-app-eth").default;
const ledgerService =
  require("@ledgerhq/hw-app-eth/lib/services/ledger").default;

async function createAirgappedSigner() {
  try {
    // Connect to Ledger
    const transport = await TransportNodeHid.create();
    const eth = new Eth(transport);

    // Get the Ethereum address from Ledger
    const { address } = await eth.getAddress("44'/60'/0'/0/0");
    console.log("Ledger Ethereum Address:", address);
    // Create a transaction object (replace with your actual transaction details)
    const transaction = {
      to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      value: ethers.parseEther("0.1"),
      gasLimit: 21000,
      gasPrice: ethers.parseUnits("20", "gwei"),
      nonce: 0,
      chainId: 1,
    };

    // Create an unsigned transaction
    const unsignedTx = ethers.Transaction.from(transaction);

    // Get the serialized unsigned transaction
    const serializedTx = unsignedTx.unsignedSerialized.slice(2); // Remove '0x' prefix

    // Resolve the transaction
    const resolution = await ledgerService.resolveTransaction(
      serializedTx,
      this.loadConfig,
      {
        externalPlugins: true,
        erc20: true,
      }
    );
    // Sign the transaction with Ledger
    const signature = await eth.signTransaction(
      "44'/60'/0'/0/0",
      serializedTx,
      resolution
    );

    console.log("Signature:", signature);

    // Combine the serialized transaction and signature
    const signedTx = ethers.Transaction.from({
      ...transaction,
      signature: {
        v: parseInt(signature.v, 16),
        r: "0x" + signature.r,
        s: "0x" + signature.s,
      },
    });

    // Get the serialized signed transaction
    const serializedSignedTx = signedTx.serialized;

    // Create the URL with the signed transaction data
    const url = `https://website.com/${serializedSignedTx}`;

    // Generate and display QR code
    qrcode.generate(url, { small: true }, (qrcode) => {
      console.log(qrcode);
    });

    // Close the transport
    await transport.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

createAirgappedSigner();
