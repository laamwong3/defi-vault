// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault {
    IERC20 public immutable token;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function _mint(address _to, uint _amount) private {
        totalSupply += _amount;
        balanceOf[_to] += _amount;
    }

    function _burn(address _from, uint _amount) private {
        totalSupply -= _amount;
        balanceOf[_from] -= _amount;
    }

    /**
     * calculation is:
     * a = amount to deposit
     * b = balance before deposit
     * t = total supply before deposit
     * s = shares to mint
     *
     * calculate how much shares to mint
     *
     * s = at / b
     */

    function deposit(uint _amount) external {
        uint shares;
        uint currentBalance = token.balanceOf(address(this));

        if (totalSupply == 0) {
            shares = _amount;
        } else {
            shares = (_amount * totalSupply) / currentBalance;
        }
        _mint(msg.sender, shares);
        token.transferFrom(msg.sender, address(this), _amount);
    }

    /**
     * calculation is:
     * a = amount to withdraw
     * b = balance before deposit
     * t = total supply before deposit
     * s = shares to burn
     *
     * a = sb / t
     */

    function withdraw(uint _shares) external {
        uint amount = (_shares * token.balanceOf(address(this))) / totalSupply;
        _burn(msg.sender, _shares);
        token.transfer(msg.sender, amount);
    }
}
