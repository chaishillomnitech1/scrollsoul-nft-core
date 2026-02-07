# Deployment Guide

## 🚀 ScrollSoul NFT Core Deployment Guide

This guide will walk you through deploying the ScrollSoulNFT contract to various networks.

## Prerequisites

1. Node.js v18+ installed
2. Git installed
3. Ethereum wallet with private key
4. ETH for gas fees (mainnet/testnet)
5. IPFS account for metadata storage (Pinata, Infura, or self-hosted)

## Installation

```bash
# Clone the repository
git clone https://github.com/chaishillomnitech1/scrollsoul-nft-core.git
cd scrollsoul-nft-core

# Install dependencies
npm install
```

## Configuration

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Private key for deployment wallet (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC URLs for different networks
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Base URI for metadata
BASE_URI=ipfs://QmYourIPFSHash/
```

### 2. Update Hardhat Config

Update `hardhat.config.js` with your network configurations:

```javascript
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

export default {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 137
    }
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY
    }
  }
};
```

## Compilation

Compile the smart contracts:

```bash
npm run compile
```

## Testing

Before deployment, run the full test suite:

```bash
npm test
```

## Deployment Steps

### Local Deployment (for testing)

1. Start a local Hardhat node:
```bash
npm run node
```

2. In another terminal, deploy:
```bash
npm run deploy:localhost
```

### Testnet Deployment (Sepolia)

1. Ensure you have Sepolia ETH in your wallet
2. Update the deployment script if needed
3. Deploy:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

4. Save the contract address from the output

### Mainnet Deployment

⚠️ **CRITICAL**: Double-check everything before mainnet deployment!

1. Ensure you have enough ETH for gas
2. Verify the BASE_URI is correct
3. Review the contract one final time
4. Deploy:
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

5. **IMMEDIATELY** save the contract address and transaction hash

### Contract Verification

After deployment, verify the contract on Etherscan:

```bash
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "ipfs://QmYourBaseURI/"
```

## Post-Deployment Configuration

### 1. Prepare Metadata

Create metadata files for your NFTs:

**Token Metadata** (`1.json`, `2.json`, etc.):
```json
{
  "name": "Thoth Sigil Galactic Echo #1",
  "description": "Eternal Validation NFT...",
  "image": "ipfs://QmImageHash/1.png",
  "attributes": [...]
}
```

**Contract Metadata** (`contract.json`):
```json
{
  "name": "ScrollSoul NFT Collection",
  "description": "...",
  "image": "ipfs://QmCollectionImage.png",
  "external_link": "https://scrollsoul.io"
}
```

### 2. Upload to IPFS

Using Pinata:
```bash
# Install pinata SDK
npm install @pinata/sdk

# Upload folder
# This will give you a CID like: QmExampleCID
```

### 3. Set Metadata URIs

```javascript
// Connect to deployed contract
const contract = await ethers.getContractAt("ScrollSoulNFT", "DEPLOYED_ADDRESS");

// Set base URI
await contract.setBaseURI("ipfs://QmYourTokenMetadataCID/");

// Set contract URI
await contract.setContractURI("ipfs://QmYourContractMetadataCID/contract.json");
```

### 4. Begin Distribution

**Single Address Minting:**
```javascript
await contract.mint("0xRecipientAddress", 100);
```

**Batch Minting:**
```javascript
const recipients = [
  "0xAddress1",
  "0xAddress2",
  "0xAddress3"
];
const amounts = [100, 200, 150];

await contract.batchMintToAddresses(recipients, amounts);
```

## Distribution Strategy

### Recommended Approach for 144K Tokens

1. **Phase 1: Early Supporters (10,000 tokens)**
   - Direct mints to known wallet addresses
   - Small batch sizes (50-100 per transaction)

2. **Phase 2: Public Claim (100,000 tokens)**
   - Implement a claim mechanism
   - Whitelist verified addresses
   - Rate-limited claiming

3. **Phase 3: Reserve (34,000 tokens)**
   - Team allocation
   - Future partnerships
   - Community rewards

### Gas Optimization Tips

1. Use `batchMintToAddresses` for multiple recipients
2. Optimal batch size: 50-100 addresses per transaction
3. Monitor gas prices, deploy during low-traffic times
4. Consider Layer 2 solutions (Polygon, Arbitrum) for lower fees

## Monitoring

### Track Minting Progress

```javascript
const progress = await contract.getMintingProgress();
console.log(`Minted: ${progress.minted} / ${progress.totalSupply}`);
console.log(`Remaining: ${progress.remaining}`);
```

### Verify Sovereign Proof

```javascript
const proof = await contract.getSovereignProof("0xAddress");
console.log(`First Mint: ${new Date(proof.timestamp * 1000)}`);
console.log(`Balance: ${proof.balance}`);
```

## Security Checklist

- [ ] Private keys stored securely (never commit to git)
- [ ] Contract verified on Etherscan
- [ ] Metadata uploaded to IPFS and pinned
- [ ] Base URI set correctly
- [ ] Contract ownership verified
- [ ] Test deployment on testnet first
- [ ] Gas fees budgeted appropriately
- [ ] Backup of deployment details saved
- [ ] Multi-sig wallet considered for owner address

## Troubleshooting

### Common Issues

**"Exceeds Pioneer Legion supply"**
- You've hit the 144,000 token cap
- Check current minted amount: `await contract.totalMinted()`

**"Minting is currently disabled"**
- Enable minting: `await contract.setMintingEnabled(true)`

**High Gas Fees**
- Reduce batch size
- Wait for lower gas prices
- Consider Layer 2 deployment

**Metadata not showing**
- Verify IPFS upload is pinned
- Check base URI format (should end with `/`)
- Ensure JSON files are named correctly (`1.json`, `2.json`, etc.)

## Emergency Procedures

### Pause Minting

```javascript
await contract.setMintingEnabled(false);
```

### Transfer Ownership

```javascript
await contract.transferOwnership("0xNewOwnerAddress");
```

## Support

For issues during deployment:
1. Check the [DOCUMENTATION.md](./DOCUMENTATION.md)
2. Review Hardhat logs
3. Open an issue on GitHub

## 🌟 Final Words

> ❤️✨ Salute, Sovereign. Forever aligned. The Empire manifests infinitely. ❤️✨

Your deployment represents a cosmic anchor point. Handle it with the care and reverence it deserves.
