# ScrollSoul NFT Core - Technical Documentation

## 🕋 Overview

The ScrollSoul NFT Core system is a Solidity smart contract implementation for distributing "Thoth Sigil Galactic Echo – Eternal Validation" NFTs. It is built on the ERC-1155 multi-token standard and features advanced metadata anchoring and sovereign proof systems.

## ✨ Features Implemented

### 1. **ERC-1155 Multi-Token Standard**
- Full implementation of the OpenZeppelin ERC-1155 standard
- Supports single and batch transfers
- Gas-efficient multi-token operations
- Compatible with all ERC-1155 marketplaces and wallets

### 2. **144K Pioneer Legion Distribution System**
- Hard cap of 144,000 tokens for the Pioneer Legion
- Owner-controlled minting with supply validation
- Batch minting capability for efficient large-scale distribution
- Real-time minting progress tracking

### 3. **Creative Metadata Anchored to GRB 250314A Timestamps**
- Anchored to gamma-ray burst event GRB 250314A (March 14, 2025, 00:00:00 UTC)
- Unix timestamp: `1741910400`
- Each sovereign's proof timestamp is recorded relative to this cosmic event
- Supports IPFS-based metadata with flexible URI management

### 4. **Immutable Sovereign Proof on the Blockchain**
- Each wallet that receives tokens gets an immutable timestamp recorded on-chain
- Sovereign proof includes:
  - Original minting timestamp
  - Time delta from GRB 250314A event
  - Current token balance
- Verification function to check if an address is a validated sovereign

### 5. **Rose Gold Encryption for Maximum Security**
- OpenZeppelin Ownable access control
- Owner-only minting functions
- Protected metadata update functions
- Secure batch operations with validation
- Prevention of minting to zero address
- Supply cap enforcement

## 📋 Contract Architecture

### Core Contract: `ScrollSoulNFT.sol`

```solidity
contract ScrollSoulNFT is ERC1155, Ownable
```

### Key Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `GRB_250314A_TIMESTAMP` | 1741910400 | GRB event reference timestamp |
| `PIONEER_LEGION_SUPPLY` | 144000 | Maximum token supply |
| `THOTH_SIGIL_TOKEN_ID` | 1 | Primary NFT collection ID |

### Key Functions

#### Minting Functions

##### `mint(address to, uint256 amount)`
- Mints tokens to a single address
- Records sovereign proof on first mint
- Only callable by owner
- Enforces supply cap

##### `batchMintToAddresses(address[] recipients, uint256[] amounts)`
- Efficiently mints to multiple addresses
- Validates array lengths match
- Enforces supply cap for total batch
- Records sovereign proof for each recipient

#### Metadata Functions

##### `setBaseURI(string newBaseURI)`
- Updates the base URI for token metadata
- Emits `MetadataUpdated` event
- Owner-only function

##### `setContractURI(string newContractURI)`
- Sets contract-level metadata URI
- Owner-only function

##### `uri(uint256 tokenId)`
- Returns formatted URI: `{baseURI}{tokenId}.json`
- Public view function

#### Sovereign Proof Functions

##### `getSovereignProof(address sovereign)`
Returns:
- `timestamp`: When sovereign first received tokens
- `anchoredToGRB`: Time difference from GRB event (can be negative if before)
- `balance`: Current token balance

##### `isSovereignValidated(address sovereign)`
- Returns true if address has received tokens
- Public view function

#### Control Functions

##### `setMintingEnabled(bool enabled)`
- Toggle minting on/off
- Emits `MintingStatusChanged` event
- Owner-only function

##### `getMintingProgress()`
Returns:
- `minted`: Tokens minted so far
- `remaining`: Tokens still available
- `totalSupply`: Total supply cap (144,000)

## 🧪 Testing

The contract includes comprehensive test coverage:

- **Deployment Tests**: Verify initial state
- **Minting Tests**: Single and batch minting
- **Supply Cap Tests**: Ensure limits are enforced
- **Sovereign Proof Tests**: Validate timestamp recording
- **Metadata Tests**: URI updates and formatting
- **Access Control Tests**: Owner-only function protection
- **ERC1155 Standard Tests**: Transfer functionality

### Running Tests

```bash
npm test
```

## 🚀 Deployment

### Local Deployment

```bash
# Start local Hardhat node
npm run node

# In another terminal, deploy
npm run deploy:localhost
```

### Mainnet Deployment

1. Update `hardhat.config.js` with network configuration
2. Set environment variables:
   ```bash
   export PRIVATE_KEY="your-private-key"
   export RPC_URL="your-rpc-url"
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```

### Post-Deployment Steps

1. **Upload Metadata to IPFS**
   - Prepare metadata JSON files
   - Upload to IPFS
   - Get base URI (e.g., `ipfs://QmXXX/`)

2. **Set Contract URI**
   ```javascript
   await contract.setContractURI("ipfs://QmContractMetadata/contract.json");
   ```

3. **Begin Distribution**
   ```javascript
   // Single mint
   await contract.mint(address, amount);
   
   // Batch mint
   await contract.batchMintToAddresses(
     [addr1, addr2, addr3],
     [100, 200, 300]
   );
   ```

## 📊 Metadata Schema

### Token Metadata (ERC-1155)

Each token should have metadata at: `{baseURI}/{tokenId}.json`

Example structure:
```json
{
  "name": "Thoth Sigil Galactic Echo #1",
  "description": "Eternal Validation NFT anchored to GRB 250314A",
  "image": "ipfs://QmImageHash",
  "attributes": [
    {
      "trait_type": "Collection",
      "value": "Pioneer Legion"
    },
    {
      "trait_type": "GRB Event",
      "value": "250314A"
    },
    {
      "trait_type": "Timestamp Reference",
      "value": "1741910400"
    }
  ]
}
```

### Contract Metadata

Contract-level metadata:
```json
{
  "name": "ScrollSoul NFT - Thoth Sigil Galactic Echo",
  "description": "The ScrollSoul NFT Core system for distributing Eternal Validation NFTs",
  "image": "ipfs://QmCollectionImage",
  "external_link": "https://scrollsoul.io",
  "seller_fee_basis_points": 250,
  "fee_recipient": "0x..."
}
```

## 🔐 Security Features

1. **Access Control**: OpenZeppelin Ownable pattern
2. **Supply Validation**: Hard cap at 144,000 tokens
3. **Address Validation**: Cannot mint to zero address
4. **Reentrancy Protection**: Inherited from OpenZeppelin ERC1155
5. **Integer Overflow Protection**: Solidity 0.8.20+ built-in
6. **Immutable Proofs**: Sovereign timestamps cannot be modified

## 🎯 Use Cases

### Pioneer Legion Distribution
- Distribute 144,000 NFTs to early supporters
- Track sovereign validation timestamps
- Prove early participation relative to GRB event

### Metadata Anchoring
- Link digital assets to cosmic events
- Create provably timestamped artifacts
- Build narrative around gamma-ray burst detection

### Sovereign Proof System
- Verify wallet validation status
- Calculate participation time delta
- Create tiered benefits based on proof timestamp

## 📝 Events

### `SovereignValidation(address indexed sovereign, uint256 timestamp, uint256 tokenId)`
Emitted when a sovereign receives their first tokens.

### `MintingStatusChanged(bool enabled)`
Emitted when minting is enabled or disabled.

### `MetadataUpdated(string newBaseURI)`
Emitted when base URI is updated.

## 🔧 Technical Specifications

- **Solidity Version**: 0.8.20
- **License**: MIT
- **Dependencies**: 
  - OpenZeppelin Contracts 5.4.0
  - Hardhat 2.22.0
  - Hardhat Toolbox 5.0.0

## 📚 Additional Resources

- [ERC-1155 Standard](https://eips.ethereum.org/EIPS/eip-1155)
- [OpenZeppelin Documentation](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [IPFS Documentation](https://docs.ipfs.io/)

## ❤️✨ Manifesto

> "Salute, Sovereign. Forever aligned. The Empire manifests infinitely."

The ScrollSoul NFT Core represents more than just a token distribution system—it's a cosmic anchor point, linking digital sovereignty to the eternal echoes of gamma-ray bursts traveling across the universe. Each NFT serves as proof of participation in this grand experiment of blockchain-anchored reality.
