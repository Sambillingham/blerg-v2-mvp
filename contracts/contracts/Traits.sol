// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Traits is ERC1155, Ownable {
    constructor() ERC1155("") {}

    string public name = 'Items';
    string public symbol = 'ITM';


    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mintBatch(uint256[] memory ids, uint256[] memory amounts)
        public
        onlyOwner
    {
        _mintBatch(msg.sender, ids, amounts, '');
    }
}