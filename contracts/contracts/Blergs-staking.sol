// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";


interface ERC1155 {
    function staked(address userAddress, uint256 id) external view returns (bool);
}

contract BlergsStaking is ERC721, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public blankBlergRef = '0000'; 
    address traitsContractAddress;
    mapping(uint256 => string) public artworkRef;
    mapping(uint256 => uint256[]) public blergTraits;

    constructor() ERC721("Bl-", "BV2") {}

    function setTraitsAddress(address traitsAddress) public {
        traitsContractAddress = traitsAddress;
    }

    function _baseURI() internal pure override returns (string memory) {
        return 'uri://';
    }

    function setTraits(uint256 tokenId, uint256[5] calldata traits ) public {
        require(ownerOf(tokenId) == msg.sender , "Must Own The Blerg");

        for (uint256 i = 0; i < traits.length; i++) {
            if(!ERC1155(traitsContractAddress).staked(msg.sender, traits[i])){
                revert("Trait is not staked");
            }
        }

        blergTraits[tokenId] = traits;
    }
    
    // Fetch TokenURI based on TokenId
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        
        string memory baseURI = _baseURI();

        string memory artRef = '';

        for (uint256 i = 0; i < blergTraits[tokenId].length; i++) {
            artRef = string.concat(artRef, Strings.toString(blergTraits[tokenId][i]));
            artRef = string.concat(artRef,'_');
        }

        for (uint256 i = 0; i < blergTraits[tokenId].length; i++) {
            if(!ERC1155(traitsContractAddress).staked(msg.sender,   blergTraits[tokenId][i])){
                return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, blankBlergRef)) : "";
            }
        }
        
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, artRef)) : "";
    }
    
    // Minted w/ Traits
    function mintWithTraits(uint256[5] calldata traits) public {
        uint256 tokenId = _tokenIds.current();

        _safeMint(msg.sender, tokenId);
        setTraits(tokenId, traits);
        _tokenIds.increment();
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        artworkRef[tokenId] = blankBlergRef;
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
