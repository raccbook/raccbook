// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract Orderbook {
    constructor() {}

    function marketBid() public {}

    function marketAsk() public {}

    function limitBid() public {}

    function limitAsk() public {}

    function repay() public {}

    function liquidate() public {}

    function getBidIds() public view returns (uint[] memory) {}

    function getAskIds() public view returns (uint[] memory) {}
}
