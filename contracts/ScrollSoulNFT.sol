// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ScrollSoulNFT
 * @dev ERC-1155 Multi-Token Standard for Thoth Sigil Galactic Echo NFTs
 * @notice Implements 144K Pioneer Legion Distribution System with GRB 250314A timestamp anchoring
 */
contract ScrollSoulNFT is ERC1155, Ownable {
    using Strings for uint256;

    // GRB 250314A Event Timestamp (March 14, 2025, gamma-ray burst detection)
    uint256 public constant GRB_250314A_TIMESTAMP = 1741910400; // March 14, 2025 00:00:00 UTC
    
    // Total supply for Pioneer Legion (144,000 tokens)
    uint256 public constant PIONEER_LEGION_SUPPLY = 144000;
    
    // Token ID for the main NFT collection
    uint256 public constant THOTH_SIGIL_TOKEN_ID = 1;
    
    // Tracking variables
    uint256 public totalMinted;
    bool public mintingEnabled = true;
    
    // Mapping to track sovereign proof (wallet => timestamp)
    mapping(address => uint256) public sovereignProof;
    
    // Contract metadata URI
    string private _contractURI;
    string private _baseTokenURI;
    
    // Events
    event SovereignValidation(address indexed sovereign, uint256 timestamp, uint256 tokenId);
    event MintingStatusChanged(bool enabled);
    event MetadataUpdated(string newBaseURI);
    
    /**
     * @dev Constructor sets up the ERC-1155 with base URI
     * @param baseURI Initial base URI for token metadata
     */
    constructor(string memory baseURI) ERC1155(baseURI) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Mint Thoth Sigil NFT with sovereign proof anchored to GRB 250314A
     * @param to Address to receive the NFT
     * @param amount Number of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(mintingEnabled, "Minting is currently disabled");
        require(totalMinted + amount <= PIONEER_LEGION_SUPPLY, "Exceeds Pioneer Legion supply");
        require(to != address(0), "Cannot mint to zero address");
        
        _mint(to, THOTH_SIGIL_TOKEN_ID, amount, "");
        
        // Record sovereign proof with timestamp
        if (sovereignProof[to] == 0) {
            sovereignProof[to] = block.timestamp;
        }
        
        totalMinted += amount;
        
        emit SovereignValidation(to, block.timestamp, THOTH_SIGIL_TOKEN_ID);
    }
    
    /**
     * @dev Batch mint to multiple addresses for efficient Pioneer Legion distribution
     * @param recipients Array of addresses to receive NFTs
     * @param amounts Array of amounts for each recipient
     */
    function batchMintToAddresses(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(mintingEnabled, "Minting is currently disabled");
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(totalMinted + totalAmount <= PIONEER_LEGION_SUPPLY, "Exceeds Pioneer Legion supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Cannot mint to zero address");
            
            _mint(recipients[i], THOTH_SIGIL_TOKEN_ID, amounts[i], "");
            
            // Record sovereign proof
            if (sovereignProof[recipients[i]] == 0) {
                sovereignProof[recipients[i]] = block.timestamp;
            }
            
            emit SovereignValidation(recipients[i], block.timestamp, THOTH_SIGIL_TOKEN_ID);
        }
        
        totalMinted += totalAmount;
    }
    
    /**
     * @dev Toggle minting on/off
     * @param enabled New minting status
     */
    function setMintingEnabled(bool enabled) external onlyOwner {
        mintingEnabled = enabled;
        emit MintingStatusChanged(enabled);
    }
    
    /**
     * @dev Update base URI for metadata
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        _setURI(newBaseURI);
        emit MetadataUpdated(newBaseURI);
    }
    
    /**
     * @dev Set contract-level metadata URI
     * @param newContractURI New contract URI
     */
    function setContractURI(string memory newContractURI) external onlyOwner {
        _contractURI = newContractURI;
    }
    
    /**
     * @dev Returns the URI for a given token ID
     * @param tokenId Token ID to query
     */
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }
    
    /**
     * @dev Returns contract-level metadata URI
     */
    function contractURI() public view returns (string memory) {
        return _contractURI;
    }
    
    /**
     * @dev Get sovereign proof details for an address
     * @param sovereign Address to query
     * @return timestamp The timestamp when sovereign received their first token
     * @return anchoredToGRB Time difference from GRB 250314A event
     * @return balance Current token balance
     */
    function getSovereignProof(address sovereign) external view returns (
        uint256 timestamp,
        int256 anchoredToGRB,
        uint256 balance
    ) {
        timestamp = sovereignProof[sovereign];
        anchoredToGRB = int256(timestamp) - int256(GRB_250314A_TIMESTAMP);
        balance = balanceOf(sovereign, THOTH_SIGIL_TOKEN_ID);
    }
    
    /**
     * @dev Get minting progress
     * @return minted Number of tokens minted
     * @return remaining Number of tokens remaining
     * @return totalSupply Total supply cap
     */
    function getMintingProgress() external view returns (
        uint256 minted,
        uint256 remaining,
        uint256 totalSupply
    ) {
        minted = totalMinted;
        totalSupply = PIONEER_LEGION_SUPPLY;
        remaining = totalSupply - minted;
    }
    
    /**
     * @dev Verify if an address is a validated sovereign
     * @param sovereign Address to verify
     * @return True if the address has received tokens
     */
    function isSovereignValidated(address sovereign) external view returns (bool) {
        return sovereignProof[sovereign] > 0;
    }
}
