// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";


interface ERC1155 {
    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external view returns (uint256[] memory);
    function balanceOf(address account, uint256 id) external view returns (uint256);
}

contract Blergs is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public blankBlergRef = '0000'; 
    address traitsContractAddress;
    mapping(uint256 => string) public artworkRef;

    constructor() ERC721 ("Bl-", "BV2") {}

    function setTraitsAddress(address traitsAddress) public {
        traitsContractAddress = traitsAddress;
    }

    function _baseURI() internal pure override returns (string memory) {
        return 'uri://';
    }

    function setTraits(uint256 tokenId, uint256[] calldata traits ) public {
        require(ownerOf(tokenId) == msg.sender , "Must Own The Blerg");
        
        address[] memory accounts = new address[](5);
        for (uint256 i = 0; i < accounts.length; i++) {
            accounts[i] = msg.sender;
        }

        uint256[] memory balances = ERC1155(traitsContractAddress).balanceOfBatch(accounts, traits);
        string memory artRef = '';

        for (uint256 i = 0; i < balances.length; i++) {
            require(balances[i] > 0 , "Missing Trait");
            artRef = string.concat(artRef, Strings.toString(traits[i]));
            artRef = string.concat(artRef,'_');
        }

        artworkRef[tokenId] = artRef;
        console.log("Artwork saved", tokenId, artRef);
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, artworkRef[tokenId])) : "";
    }

    // Minted Blank
    function mint() public {
        uint256 tokenId = _tokenIds.current();

        _safeMint(msg.sender, tokenId);
        artworkRef[tokenId] = blankBlergRef;
    
        _tokenIds.increment();
        console.log("ID: %s minted => %s", tokenId, msg.sender);
    }
    
    // Minted w/ Traits
    function mintWithTraits(uint256[] calldata traits) public {
        uint256 tokenId = _tokenIds.current();

        _safeMint(msg.sender, tokenId);
        setTraits(tokenId, traits);
        _tokenIds.increment();
        console.log("ID: %s minted => %s | W/ Traits", tokenId, msg.sender);
    }
}
