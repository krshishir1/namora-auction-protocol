# DomaBid - Decentralized Domain Auction Protocol

DomaBid is a decentralized auction protocol built on the Doma Protocol, designed to make domain auctions transparent, secure, and globally accessible. Unlike traditional marketplaces—which are centralized, charge heavy fees, lack bidding transparency, and depend on escrow services for trust—DomaBid ensures a seamless and trustless experience. Domain transfers are faster, more secure, and liquid, eliminating the inefficiencies that keep valuable domains locked in outdated systems.

## 🚀 Project Overview

At its core, DomaBid leverages the Doma Protocol's infrastructure for domain listing and integrates the Orderbook API to create and manage offers. It is powered by:

- **Subgraph API** for indexing all tokenized domains owned by a user and tracking offers made on those domains
- **Smart contracts** for registering new auctions and submitting bids in a secure, verifiable manner
- **Orderbook API** for creating and maintaining orders within the auction flow

DomaBid adopts an **English auction mechanism**, where the price of a domain increases as bids are placed, ensuring fair competition and maximizing the domain's value over time.

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **Wagmi** - React hooks for Ethereum
- **RainbowKit** - Wallet connection UI
- **Viem** - TypeScript interface for Ethereum
- **Zustand** - Lightweight state management

### Smart Contracts
- **Solidity 0.8.28** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure smart contract library
- **Viem** - Ethereum interaction library

### Blockchain & APIs
- **Ethereum Sepolia Testnet** - Primary network
- **Doma Protocol SDK** - Domain tokenization and orderbook
- **Graph Protocol** - Subgraph for indexing
- **IPFS** - Decentralized storage

## 📋 Features

- 🔐 **Secure Wallet Integration** - Connect with MetaMask, WalletConnect, and more
- 🏷️ **Domain Tokenization** - Convert domains into tradeable NFTs
- ⚡ **English Auctions** - Transparent bidding mechanism
- 📊 **Real-time Bidding** - Live auction updates
- 🔄 **Automatic Orderbook Sync** - Seamless integration with Doma Protocol
- 📱 **Responsive Design** - Works on all devices
- 🌐 **Multi-chain Support** - Ethereum Sepolia testnet



### Deployed Contract Addresses

#### Sepolia Testnet
- **EnglishAuction Contract**: `0xf7a5919AbF08A7F5D5088988aa0c3deD9917fe4C`


