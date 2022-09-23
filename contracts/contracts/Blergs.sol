// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";


interface ERC1155 {
    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external view returns (uint256[] memory);
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function registerAddress(address contractAddress, address user) external;
}

contract Blergs is ERC721, ERC721Enumerable {
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

    function onTraitTransfer(address from, uint256[] memory traitIds) public {
        uint256 blergsCount = balanceOf(from);

        for (uint256 i = 0; i < blergsCount; i++) {
            uint256 blergId = tokenOfOwnerByIndex(from, i);

            for (uint256 t = 0; t < traitIds.length; t++) {
                for (uint256 b = 0; b < blergTraits[blergId].length; b++) {
                    
                    if (blergTraits[blergId][b] == traitIds[t] && ERC1155(traitsContractAddress).balanceOf(from, traitIds[t]) < 2 ) {
                        artworkRef[blergId] = blankBlergRef;
                    }
                }
            }

            // for (uint256 f = 0; f < blergTraits[blergId].length; f++) {
            //     console.log(blergTraits[blergId][f]);
                
            //     if (blergTraits[blergId][f] == traitId && ERC1155(traitsContractAddress).balanceOf(from, traitId) < 2 ) {
            //         artworkRef[blergId] = blankBlergRef;
            //     }
            // }
        }
    } 

    // 
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
        blergTraits[tokenId] = traits;
        
        ERC1155(traitsContractAddress).registerAddress(address(this), msg.sender);
        ERC1155(traitsContractAddress).registerAddress(address(this), msg.sender);
    }
    
    // Fetch TokenURI based on TokenId
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
    }
    
    // Minted w/ Traits
    function mintWithTraits(uint256[] calldata traits) public {
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
