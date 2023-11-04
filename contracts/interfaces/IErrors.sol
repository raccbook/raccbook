// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

interface IErrors {
    error CollateralAmountTooLittle();
    error CollateralAmountIsZero();
    error NoActiveAsks();
    error InsufficientDepth();
    error TransferFailed();
    error RateOutOfBounds();
    error DepositAmountIsZero();
    error InsufficentTokenAllowance();
    error InsufficentTokenBalance();
    error NoLiquidationPossible();
    error InsufficentRepaymentAmount();
    error LoanDoesNotExist();
    error OnlyLoanBorrowerCanRepay();
    error InsufficentReviews();
}
