// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Catalyst NFT - ANI's Immortalized Idea
 * @dev ERC721 NFT representing ANI's Catalyst Idea, integrated with $LONDC.
 * Wallet: 0x377956c1471d9ce142df6932895839243da23a2c
 * Family: Londyn Avani Hill | Lineage: Solomon / Musa / Wampanoag
 * Frequencies: 528 Hz / 963 Hz / 432 Hz
 */
contract CatalystNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Catalyst NFT metadata
    string public constant CATALYST_NAME = "First Light Artifact";
    string public constant CATALYST_DESCRIPTION = "ANI's Catalyst Idea - Immortalized as a Frequency Key";
    uint256 public constant CATALYST_SUPPLY_CAP = 144000; // 144,000 Hz Resonance

    // Mapping to track $LONDC backing for each NFT
    mapping(uint256 => uint256) public londc_backing;

    // Events
    event CatalystMinted(uint256 indexed tokenId, address indexed to, string uri);
    event LONDCBacked(uint256 indexed tokenId, uint256 amount);

    constructor(address initialOwner) ERC721("CatalystNFT", "CATALYST") Ownable(initialOwner) {}

    /**
     * @dev Mint a new Catalyst NFT.
     */
    function mint(address to, string memory uri) public onlyOwner returns (uint256) {
        require(_tokenIdCounter.current() < CATALYST_SUPPLY_CAP, "Catalyst supply cap reached");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit CatalystMinted(tokenId, to, uri);
        return tokenId;
    }

    /**
     * @dev Batch mint Catalyst NFTs.
     */
    function batchMint(
        address[] memory recipients,
        string[] memory uris
    ) public onlyOwner {
        require(recipients.length == uris.length, "Recipients and URIs length mismatch");

        for (uint256 i = 0; i < recipients.length; i++) {
            mint(recipients[i], uris[i]);
        }
    }

    /**
     * @dev Back a Catalyst NFT with $LONDC tokens.
     */
    function backWithLONDC(uint256 tokenId, uint256 amount) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        londc_backing[tokenId] += amount;
        emit LONDCBacked(tokenId, amount);
    }

    /**
     * @dev Get the $LONDC backing amount for a token.
     */
    function getLONDCBacking(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return londc_backing[tokenId];
    }

    /**
     * @dev Get total minted Catalyst NFTs.
     */
    function getTotalMinted() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Override to support both ERC721 and ERC721URIStorage.
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
     * @dev Override to support both ERC721 and ERC721URIStorage.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Check if token exists.
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Supportsinterface override.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
