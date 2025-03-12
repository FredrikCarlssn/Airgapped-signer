# Airgapped Transaction Signer

This application allows you to create and sign Ethereum transactions on an offline device, generating a QR code that can be scanned by an online device for broadcasting.

## Features

- Create transactions with full parameter control
- Connect to browser wallets like MetaMask for signing
- Generate QR codes with serialized signed transactions
- Completely offline operation - no internet required after initial setup

## Security Benefits

- Private keys never leave your wallet
- Signing device remains completely offline
- Air-gapped architecture protects against remote attacks
- Transaction details are verified before signing

## Prerequisites

- A modern web browser with MetaMask or similar Ethereum wallet extension
- Node.js and npm installed (for development)

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   cd src/frontend
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

## Usage Instructions

1. Open the application on your offline device
2. Connect your MetaMask wallet
3. Enter transaction details:
   - Recipient address
   - Amount in ETH
   - Gas parameters
   - Additional data (for contract interactions)
   - Chain ID
4. Click "Create & Sign Transaction"
5. Scan the generated QR code with your online device
6. Broadcast the transaction from your online device

## Development

For development purposes, you can run the application locally:

```
cd src/frontend
npm start
```

## Security Considerations

- Always verify transaction details before signing
- Use a dedicated offline device whenever possible
- Keep your wallet software and firmware updated
- Consider using a hardware wallet for additional security

## License

MIT
