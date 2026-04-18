// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {HelloArc} from "../src/Counter.sol";

contract HelloArcTest is Test {
    HelloArc hello;

    function setUp() public {
        hello = new HelloArc();
    }

    function testMessage() public {
        assertEq(hello.message(), "Hello Arc!");
    }
}