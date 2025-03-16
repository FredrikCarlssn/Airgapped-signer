import Safe, {
  PredictedSafeProps,
  SafeAccountConfig
} from '@safe-global/protocol-kit'
import dotenv from 'dotenv';
import readlineSync from 'readline-sync';
import { readPrivateKeyFromKeystore } from './keystore';

dotenv.config();

async function createSafe(): Promise<void> {
  try {
    // Get keystore path from env or use default
    const keystorePath = process.env.KEYSTORE_PATH || '';  
    const rpcUrl = process.env.RPC_URL || '';
    console.log(`Using keystore at: ${keystorePath}`);
    
    // Get password from user input with hidden characters
    const password = readlineSync.question('Enter keystore password: ', { hideEchoBack: true });
    
    // Get private key from keystore
    const privateKey = await readPrivateKeyFromKeystore(keystorePath, password);
    
    if (!privateKey || !rpcUrl) {
      console.log('No private key or RPC URL found, cannot create Safe');
      return;
    }
    
    // @DEV: Add your own addresses here PT1
    const address_5: string = "0xadE47C57ECb0AAe8E3012BF18932809D4422FA5c";
    const address_6: string = "0x2FaA5b7cCb8d3e04E7eA6308Fc0FE8daDC0560E1";
    const address_7: string = "0x839Ed92f933a059b142cC42d26c1D2cacC57E2db";

       // Create Safe
    const safeAccountConfig: SafeAccountConfig = {
      // @DEV: Add your own addresses here PT2
      owners: [address_5, address_6, address_7],
      // @DEV: Set your own threshold here
      threshold: 2,
    };

    const predictedSafe: PredictedSafeProps = {
      safeAccountConfig
    }

    // Initialize SafeFactory with the signer
    const protocolKit = await Safe.init({
      provider: rpcUrl,
      signer: privateKey,
      predictedSafe
    })
    console.log("Deploying Safe...");
    const safeAddress = await protocolKit.getAddress()
    const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction()  
    console.log("Your Safe has been deployed:", deploymentTransaction);
    console.log(`https://etherscan.io/address/${safeAddress}`);
    console.log(`https://app.safe.global/eth:${safeAddress}`);
    
  } catch (error) {
    console.error("Error in createSafe function:", error);
  }
}

createSafe().catch((error: Error) => {
  console.error("Unhandled error in createSafe:", error);
});
