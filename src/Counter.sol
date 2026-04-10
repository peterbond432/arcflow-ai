// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloArc {
    string public message = "Hello Arc";

    function setMessage(string memory _msg) public {
        message = _msg;
    }
}