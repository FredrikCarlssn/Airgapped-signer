import * as fs from 'fs';
import { ethers } from 'ethers';

/**
 * Reads a private key from a keystore file.
 * @param keystorePath Path to the keystore file
 * @param password Password to decrypt the keystore
 * @returns The private key or null if the keystore doesn't exist
 */
export const readPrivateKeyFromKeystore = async (
  keystorePath: string,
  password: string
): Promise<string | null> => {
  try {
    // Check if keystore file exists
    if (!fs.existsSync(keystorePath)) {
      console.log(`Keystore file not found at ${keystorePath}, skipping...`);
      return null;
    }

    // Read keystore file
    const keystoreContent = fs.readFileSync(keystorePath, 'utf8');
    const wallet = await ethers.Wallet.fromEncryptedJson(keystoreContent, password);
    return wallet.privateKey;
  } catch (error) {
    console.error(`Error reading keystore: ${error}`);
    throw error;
  }
};