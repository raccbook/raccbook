// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

interface IErrors {
    error CollateralAmountTooLittle();
    error CollateralAmountIsZero();
    error NoActiveAsks();
    error InsufficientDepth();
    error TransferFailed();
    error RateOutOfBounds();
}
