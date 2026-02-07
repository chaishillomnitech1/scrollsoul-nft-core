# scrollsoul-nft-core

🕋 **ScrollSoul NFT Core - Thoth Sigil Minting Platform** 🌌

The ScrollSoul NFT Core system forms the foundation for distributing the "Thoth Sigil Galactic Echo – Eternal Validation" NFTs. Built using the ERC-1155 multi-token standard with IPFS decentralized storage and Rose Gold encryption.

## ✨ Features

- ✅ **ERC-1155 Multi-Token Standard** - Full OpenZeppelin implementation
- ✅ **144K Pioneer Legion Distribution System** - Hard-capped supply management
- ✅ **Creative Metadata Anchored to GRB 250314A** - Cosmic timestamp references
- ✅ **Immutable Sovereign Proof on the Blockchain** - On-chain validation records
- ✅ **Rose Gold Encryption** - Maximum security with OpenZeppelin contracts

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/chaishillomnitech1/scrollsoul-nft-core.git
cd scrollsoul-nft-core

# Install dependencies
npm install
```

### Compilation

The smart contract can be compiled using Solidity compiler:

```bash
# Compile contracts
npm run compile
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run coverage
```

### Deployment

```bash
# Deploy to local Hardhat network
npm run deploy:localhost

# Deploy to configured network
npm run deploy
```

## 📋 Contract Overview

The `ScrollSoulNFT` contract implements:

- **Pioneer Legion Supply**: 144,000 tokens maximum
- **GRB 250314A Reference**: Anchored to March 14, 2025 (timestamp: 1741910400)
- **Sovereign Proof System**: Immutable timestamp records for each holder
- **Flexible Metadata**: IPFS-based URIs with update capability
- **Batch Operations**: Efficient multi-address distribution

## 📚 Documentation

For detailed technical documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)

## 🏗️ Project Structure

```
scrollsoul-nft-core/
├── contracts/
│   └── ScrollSoulNFT.sol       # Main ERC-1155 NFT contract
├── test/
│   └── ScrollSoulNFT.test.js   # Comprehensive test suite
├── scripts/
│   └── deploy.js               # Deployment script
├── hardhat.config.js           # Hardhat configuration
├── package.json
├── DOCUMENTATION.md            # Detailed technical docs
└── README.md                   # This file
```

## 🧪 Testing

The project includes comprehensive test coverage:

- Deployment and initialization
- Minting (single and batch)
- Supply cap enforcement
- Sovereign proof recording
- Metadata management
- Access control
- ERC-1155 standard compliance

## 🔐 Security

- OpenZeppelin battle-tested contracts
- Owner-only minting controls
- Supply cap validation
- Zero address protection
- Immutable proof system

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Sovereign Manifesto

> ❤️✨ **Salute, Sovereign. Forever aligned. The Empire manifests infinitely.** ❤️✨

Join the Pioneer Legion and become part of a cosmic legacy anchored to the stars.

## 🔗 Links

- **Repository**: https://github.com/chaishillomnitech1/scrollsoul-nft-core
- **Documentation**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **OpenZeppelin**: https://www.openzeppelin.com/contracts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.
