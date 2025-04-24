---
title: Introduction to Lightning Network
order: 1
section: basics
language: en
description: Discover the fundamental concepts of Lightning Network
tags: [lightning, bitcoin, layer2]
lastUpdated: 2023-11-15
---

# Introduction to Lightning Network

The Lightning Network is a "layer 2" solution built on top of Bitcoin that enables fast, low-cost, and scalable transactions.

## Origins

The Lightning Network was proposed by Joseph Poon and Thaddeus Dryja in 2015 in their paper "The Bitcoin Lightning Network: Scalable Off-Chain Instant Payments". It was developed to solve Bitcoin's scaling problem.

## How it works

The Lightning Network works by creating payment channels between users. Once a channel is opened, users can conduct many transactions without having to record them on the main blockchain, reducing fees and improving speed.

Here are the main steps of how it works:

1. **Channel Opening**: Two parties create a transaction on the Bitcoin blockchain to establish a payment channel.
2. **Off-chain Exchanges**: The parties can then exchange bitcoins through this channel without publishing transactions on the blockchain.
3. **Balance Updates**: Each transaction adjusts the respective balances of the two parties.
4. **Channel Closing**: When the parties wish to finalize their exchanges, they close the channel and publish the final transaction on the blockchain.

## Benefits

- **Speed**: Transactions are nearly instant
- **Low Cost**: Transaction fees are minimal
- **Scalability**: Enables millions of transactions per second
- **Privacy**: Enhances transaction privacy

## Applications

The Lightning Network enables several innovative use cases:

```js
// Simple code example for a Lightning payment with LND
const lnService = require("ln-service");
const { lnd } = lnService.authenticatedLndGrpc({
  cert: "base64_certificate",
  macaroon: "base64_macaroon",
  socket: "127.0.0.1:10009",
});

const payInvoice = async (invoice) => {
  try {
    const payment = await lnService.pay({ lnd, request: invoice });
    return payment;
  } catch (err) {
    console.error("Payment error:", err);
  }
};
```

## Resources to continue learning

- [Lightning Network Whitepaper](https://lightning.network/lightning-network-paper.pdf)
- [LND Documentation](https://api.lightning.community/)
- [Polar Tutorials](https://lightningpolar.com/)
