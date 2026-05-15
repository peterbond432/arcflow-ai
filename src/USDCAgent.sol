// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract USDCAgent {
    mapping(address => uint256) public balances;

    uint256 public constant COST = 0.002 ether;

    event AgentRun(address user, uint256 cost);

    // deposit funds
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // run agent (deduct cost per execution)
    function runAgent() external {
        require(balances[msg.sender] >= COST, "Insufficient balance");

        balances[msg.sender] -= COST;

        emit AgentRun(msg.sender, COST);
    }

    // check balance
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}
