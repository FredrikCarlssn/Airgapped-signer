# Transaction Broadcaster

This is an online application that receives signed transaction data from the Airgapped Transaction Signer and broadcasts it to the Ethereum network.

## Overview

The Transaction Broadcaster is designed to be the online counterpart to the Airgapped Transaction Signer, completing the offline transaction signing workflow. The signer creates and signs transactions offline, generating a QR code. The broadcaster receives the data from the QR code and submits the transaction to the blockchain.

## Features

- Receives signed transaction data via URL parameters
- Displays transaction details for verification
- Broadcasts transactions to the Ethereum network
- Shows transaction status and hash after broadcasting
- Links to block explorers for transaction tracking

## Security

This application maintains the security benefits of airgapped signing by:

1. Only handling already-signed transactions
2. Never having access to private keys
3. Acting only as a bridge between the airgapped signer and the blockchain

## How It Works

1. The offline signer creates a signed transaction and encodes it as a QR code
2. The QR code contains a URL pointing to this broadcaster with the transaction data
3. Scanning the QR code with a mobile device opens this application
4. The transaction details are displayed for review
5. The user confirms and the transaction is broadcast to the network

## Development

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

```bash
cd src/broadcast
npm install
```

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Integration with Airgapped Signer

The broadcaster is designed to work together with the Airgapped Transaction Signer. When the signer creates a transaction, it generates a QR code with a URL like:

```
https://your-domain.com/{serialized-transaction-data}
```

The broadcaster parses this data and provides a user interface for broadcasting the transaction.

## License

MIT
