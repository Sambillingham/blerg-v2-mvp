// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";


interface ERC1155 {
    function staked(address userAddress, uint256 id) external view returns (bool);
}

contract BlergsWeb is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address traitsContractAddress;

    constructor() ERC721("Bl-", "BV2") {}

    function setTraitsAddress(address traitsAddress) public {
        traitsContractAddress = traitsAddress;
    }

    function _baseURI() internal pure override returns (string memory) {
        return 'uri://';
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        
        string memory baseURI = _baseURI();

        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI,tokenId)) : "";
    }
    
    // Minted w/ Traits
    function mintWithTraits(uint256[5] calldata traits) public {
        uint256 tokenId = _tokenIds.current();

        _safeMint(msg.sender, tokenId);

        for (uint256 i = 0; i < traits.length; i++) {
            if(!ERC1155(traitsContractAddress).staked(msg.sender, traits[i])){
                revert("Trait is not staked");
            }
        }

        _tokenIds.increment();
        // event() -> listed on server
    }

}
