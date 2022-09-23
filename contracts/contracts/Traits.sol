// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface ERC721 {
    function onTraitTransfer(address from, uint256[] memory traitId) external;
}

contract Traits is ERC1155, Ownable {
    constructor() ERC1155("") {}

    string public name = 'Items';
    string public symbol = 'ITM';
    
    mapping(address => mapping(address => bool)) public equippedAddress;
    mapping (address => address[]) public equippedAddressList;

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mintBatch(uint256[] memory ids, uint256[] memory amounts)
        public
        onlyOwner
    {
        _mintBatch(msg.sender, ids, amounts, '');
    }
    
    function registerAddress(address contractAddress, address user) public {
        
        if( equippedAddress[user][contractAddress] != true) {
            equippedAddress[user][contractAddress] = true;
            equippedAddressList[user].push(contractAddress);
        }

    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155)
    {
        if ( from != address(0)) {
            for (uint256 i = 0; i < equippedAddressList[from].length; i++) {
                ERC721(equippedAddressList[from][i]).onTraitTransfer(from, ids);    
            }
        }

        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}