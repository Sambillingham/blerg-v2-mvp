// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract TraitsStaking is ERC1155, Ownable {
    constructor() ERC1155("") {}

    string public name = 'Items';
    string public symbol = 'ITM';

    mapping(address => mapping(uint256 => bool)) public staked;

    event traitStake(address sender, uint256 tokenId);
    event traitUnstake(address sender, uint256 tokenId);

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mintBatch(uint256[] memory ids, uint256[] memory amounts)
        public
        onlyOwner
    {
        _mintBatch(msg.sender, ids, amounts, '');
    }

    function stake(uint256 id) public  {
        staked[msg.sender][id] = true;

        emit traitStake(msg.sender, id);
    }

    function unstake(uint256 id) public {
        staked[msg.sender][id] = false;

        emit traitUnstake(msg.sender, id);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155)
    {
            for (uint256 i = 0; i < ids.length; i++) {
                if (staked[from][ids[i]]) {
                    revert('Token is Staked');
                }
            }

        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}