// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

interface IOrders {
    struct Ask {
        uint256 id;
        address lender;
        uint256 amount;
        uint256 rate;
        uint256 time;
    }

    struct Bid {
        uint256 id;
        address borrower;
        uint256 amount;
        uint256 rate;
        uint256 time;
    }

    struct Loan {
        uint256 id;
        address lender;
        address borrower;
        address token;
        uint256 term;
        uint256 amount;
        uint256 rate;
        uint256 startDate;
        uint256 endDate;
        uint256 repaymentAmount;
    }
}
