
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title KuverseNFT
 * @dev ERC721 Smart Contract for Kuverse NFT Collection with enhanced security
 */
contract KuverseNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Mapping from token ID to metadata
    mapping(uint256 => NFTMetadata) public tokenMetadata;
    
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string name, string rarity);
    event MetadataUpdated(uint256 indexed tokenId, string newTokenURI);
    
    struct NFTMetadata {
        string name;
        string description;
        string rarity;
        uint256 mintedAt;
    }
    
    constructor() ERC721("Kuverse NFT Collection", "KUVERSE") {}
    
    /**
     * @dev Mint a new NFT with metadata
     * @param to Address to mint the NFT to
     * @param name Name of the NFT
     * @param description Description of the NFT
     * @param rarity Rarity level of the NFT
     * @param tokenURI URI pointing to the NFT metadata
     */
    function mintNFT(
        address to,
        string memory name,
        string memory description,
        string memory rarity,
        string memory tokenURI
    ) public nonReentrant returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Store metadata
        tokenMetadata[tokenId] = NFTMetadata({
            name: name,
            description: description,
            rarity: rarity,
            mintedAt: block.timestamp
        });
        
        emit NFTMinted(to, tokenId, name, rarity);
        
        return tokenId;
    }
    
    /**
     * @dev Enhanced transfer function with proper event emission
     * @param from Address transferring from
     * @param to Address transferring to
     * @param tokenId Token ID to transfer
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override nonReentrant {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Transfer caller is not owner nor approved");
        require(to != address(0), "Transfer to zero address");
        
        _safeTransfer(from, to, tokenId, data);
    }
    
    /**
     * @dev Get NFT metadata by token ID
     */
    function getNFTMetadata(uint256 tokenId) public view returns (NFTMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return tokenMetadata[tokenId];
    }
    
    /**
     * @dev Get all NFTs owned by an address
     */
    function getNFTsByOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (_exists(i) && ownerOf(i) == owner) {
                tokenIds[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Get total supply of minted tokens
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
