// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface ERC721 {
    function onTraitTransfer(address from, uint256 traitId) external;
}

contract Traits is ERC1155, Ownable {
    constructor() ERC1155("") {}

    string public name = 'Items';
    string public symbol = 'ITM';
    address blergsContractAddress;

    function setBlergsAddress(address blergsAddress) public {
        blergsContractAddress = blergsAddress;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mintBatch(uint256[] memory ids, uint256[] memory amounts)
        public
        onlyOwner
    {
        _mintBatch(msg.sender, ids, amounts, '');
    }
    
    
    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155)
    {
        for (uint256 i = 0; i < ids.length; i++) {
            ERC721(blergsContractAddress).onTraitTransfer(operator, ids[i]);    
        }
        
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}