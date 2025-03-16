# Airgapped Transaction Signer

This application allows you to create and sign Ethereum transactions on an offline device, generating a QR code that can be scanned by an online device for broadcasting.

## Features

- Create and sign transactions offline using a keystore wallet
- Full control over all transaction parameters (recipient, value, gas, nonce, etc.)
- EIP-1559 transaction support
- QR code generation for signed transactions
- Air-gapped operation for maximum security

## Security Benefits

- Private keys never leave your offline device
- Complete isolation from network-based attacks
- Physical separation between signing and broadcasting
- Transaction details are verified before signing

## Prerequisites

- A modern web browser
- Node.js and npm installed (for development)
- An Ethereum keystore file (.json)

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the application:
   ```
   npm run build
   ```
4. Deploy the built application to your offline device

### Offline Setup

For maximum security, set up as follows:

1. Install and build the application on an online computer
2. Copy the build directory to an offline device using a USB drive
3. Serve the application on the offline device using a local server

## Transaction Creation Process

1. **Prepare your offline device**: Set up the signer application on an air-gapped device that never connects to the internet
2. **Load your keystore wallet**: Upload your Ethereum keystore file and enter your password
3. **Create a transaction**:
   - Select the target blockchain network
   - Enter the recipient address
   - Specify the amount to send in ETH
   - Set the nonce value
   - Configure gas parameters (gas limit, max fee, priority fee)
   - Add transaction data if needed (for contract interactions)
4. **Sign the transaction**: Click "Sign Transaction" to create a signed transaction
5. **Generate QR code**: The signed transaction is encoded as a QR code
6. **Broadcast the transaction**: Scan the QR code with the companion broadcasting app on an online device to send the transaction to the network

## Development

For development purposes, you can run the application locally:

```
npm start
```

## Security Considerations

- Always verify transaction details before signing
- Use a dedicated offline device whenever possible
- Keep your wallet software and firmware updated
- Never connect your signing device to the internet

## License

MIT
