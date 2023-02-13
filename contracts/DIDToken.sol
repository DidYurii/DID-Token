// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC20Burnable.sol";
import "./ERC20Capped.sol";
import "./Ownable.sol";

contract DIDToken is ERC20, ERC20Burnable, ERC20Capped, Ownable {
    constructor()
        ERC20("DID Token", "DID")
        ERC20Capped(560000000000000)
        Ownable()
    {}

    function _mint(
        address account,
        uint256 amount
    ) internal virtual override(ERC20, ERC20Capped) {
        ERC20Capped._mint(account, amount);
    }

    function mint(address _spender, uint256 amount) public virtual onlyOwner {
        _mint(_spender, amount * (10 ** decimals()));
    }
}
