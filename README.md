# Airgapped Transaction Signer

This project provides a secure, airgapped solution for signing Ethereum transactions without exposing your private keys to an internet-connected device.

## Overview

The Airgapped Transaction Signer is designed to work on a completely offline computer, enhancing security for cryptocurrency transactions. It generates a QR code that can be scanned by an online device to broadcast the signed transaction to the Ethereum network.

## Features

- Completely airgapped operation
- Supports Ledger hardware wallet integration
- Generates QR codes for signed transactions
- Compatible with EIP-1559 transactions
- Express.js server for easy transaction broadcasting

## Prerequisites

- Node.js (v14 or later)
- Ledger hardware wallet
- QR code scanner (can be a smartphone camera)

## Installation

1. Clone this repository to an airgapped computer.
2. Install dependencies:

```
npm install
```

## Usage

1. Connect your Ledger device to the airgapped computer.
2. Run the script:

```
node test.js
```

2. Set up your transaction details.
3. The script will generate a QR code containing the signed transaction.
4. Scan the QR code with an online device.
5. Use the provided Express.js server on an online machine to broadcast the transaction.

## Security Considerations

- Always use this script on an airgapped computer that has never been and will never be connected to the internet.
- Verify all transaction details on your Ledger device before signing.
