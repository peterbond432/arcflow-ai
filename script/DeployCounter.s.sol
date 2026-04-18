// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {HelloArc} from "../src/Counter.sol";

contract DeployHelloArc is Script {
    function run() external {
        vm.startBroadcast();

        HelloArc contractInstance = new HelloArc();

        vm.stopBroadcast();
    }
}