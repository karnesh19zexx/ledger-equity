// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DonationNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    
    struct Certificate {
        uint256 tokenId;
        address donor;
        uint256 donationAmount;
        uint256 studentId;
        string studentName;
        uint256 timestamp;
        string impactDescription;
        string metadataURI;
    }
    
    mapping(uint256 => Certificate) public certificates;
    mapping(address => uint256[]) public donorCertificates;
    
    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed donor,
        uint256 donationAmount,
        uint256 indexed studentId
    );
    
    constructor() ERC721("Ledger Equity Impact Certificate", "LEQNFT") Ownable(msg.sender) {}
    
    function mintCertificate(
        address _donor,
        uint256 _donationAmount,
        uint256 _studentId,
        string memory _studentName,
        string memory _impactDescription,
        string memory _metadataURI
    ) external onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(_donor, newTokenId);
        _setTokenURI(newTokenId, _metadataURI);
        
        certificates[newTokenId] = Certificate({
            tokenId: newTokenId,
            donor: _donor,
            donationAmount: _donationAmount,
            studentId: _studentId,
            studentName: _studentName,
            timestamp: block.timestamp,
            impactDescription: _impactDescription,
            metadataURI: _metadataURI
        });
        
        donorCertificates[_donor].push(newTokenId);
        
        emit CertificateMinted(newTokenId, _donor, _donationAmount, _studentId);
        
        return newTokenId;
    }
    
    function getDonorCertificates(address _donor) external view returns (uint256[] memory) {
        return donorCertificates[_donor];
    }
    
    function getCertificate(uint256 _tokenId) external view returns (Certificate memory) {
        require(_tokenId <= _tokenIds && _tokenId > 0, "Invalid token ID");
        return certificates[_tokenId];
    }
    
    function totalSupply() external view returns (uint256) {
        return _tokenIds;
    }
    
    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
