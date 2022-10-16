// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";


interface ERC1155 {
    function balanceOfBatch(address[] calldata accounts, uint256[5] calldata ids) external view returns (uint256[] memory);
}

contract BlergsWeb is ERC721, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address traitsContractAddress;

    constructor() ERC721("Bl-", "BV2") {}

    function setTraitsAddress(address traitsAddress) public {
        traitsContractAddress = traitsAddress;
    }

    function _baseURI() internal pure override returns (string memory) {
        return 'https://blerg-v2-mvp.vercel.app/api/blerg/';
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
        
        _tokenIds.increment();
    }
    

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}
