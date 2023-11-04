// SPDX-License-Identifier: UNLICENSED
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IChronicle.sol";
import "./interfaces/IErrors.sol";
import "./interfaces/IOrders.sol";

pragma solidity ^0.8.20;

contract Orderbook is IOrders, IErrors {
    uint256 LTV = 85;

    uint256 loanId;

    mapping(address => mapping(address => uint256)) public deposits;
    mapping(address => mapping(uint256 => Ask[])) public asks;
    mapping(address => mapping(uint256 => Bid[])) public bids;
    mapping(address => mapping(uint256 => Loan)) public loans;
    mapping(address => uint256[]) loanIds;
    mapping(address => uint256[]) askIds;
    mapping(address => uint256[]) bidIds;

    event MarketBid(
        address lender,
        address borrower,
        address token,
        uint256 term,
        uint256 amount,
        uint256 rate
    );

    event MarketAsk(
        address lender,
        address borrower,
        address token,
        uint256 term,
        uint256 amount,
        uint256 rate
    );

    constructor() {}

    function marketBid(address _token, uint256 _amount, uint256 _term) public {
        if (deposits[msg.sender][_token] <= 0) revert CollateralAmountIsZero();
        if (deposits[msg.sender][_token] < (_amount * 100) / LTV)
            revert CollateralAmountTooLittle();

        IERC20 token = IERC20(_token);

        Ask[] storage activeAsks = asks[_token][_term];

        if (activeAsks.length <= 0) revert NoActiveAsks();

        uint256 lowestAskIndex;
        uint256 lowestAskRate = type(uint256).max;

        for (uint256 i = 0; i < activeAsks.length; i++) {
            if (activeAsks[i].rate < lowestAskRate) {
                lowestAskRate = activeAsks[i].rate;
                lowestAskIndex = i;
            }
        }

        Ask storage lowestAsk = activeAsks[lowestAskIndex];

        if (lowestAsk.amount < _amount) revert InsufficientDepth();

        Loan memory loan = Loan({
            id: loanId,
            lender: lowestAsk.lender,
            borrower: msg.sender,
            token: _token,
            term: _term,
            amount: _amount,
            rate: lowestAskRate,
            startDate: block.timestamp,
            endDate: block.timestamp + (_term * 1 days),
            repaymentAmount: (_amount * lowestAskRate * _term) / (10000 * 365)
        });

        loans[lowestAsk.lender][loanId] = loan;
        loans[msg.sender][loanId] = loan;
        loanIds[msg.sender].push(loanId);
        loanIds[lowestAsk.lender].push(loanId);

        loanId += 1;

        if (lowestAsk.amount == _amount) {
            // remove the lowest ask
            activeAsks[lowestAskIndex] = activeAsks[activeAsks.length - 1];
            activeAsks.pop();
        } else {
            // decrement the amount of the lowest ask
            lowestAsk.amount -= _amount;
        }

        token.approve(msg.sender, _amount);

        bool isTransferred = token.transfer(msg.sender, _amount);

        if (!isTransferred) revert TransferFailed();

        deposits[msg.sender][_token] -= (_amount * 100) / LTV;

        emit MarketBid({
            lender: lowestAsk.lender,
            borrower: msg.sender,
            token: _token,
            term: _term,
            amount: _amount,
            rate: lowestAskRate
        });
    }

    function marketAsk(address _token, uint256 _amount, uint256 _term) public {
        if (deposits[msg.sender][_token] <= 0) revert CollateralAmountIsZero();
        if (deposits[msg.sender][_token] < _amount)
            revert CollateralAmountTooLittle();

        Bid[] storage activeBids = bids[_token][_term];

        if (activeBids.length <= 0) revert NoActiveAsks();

        uint256 highestBidIndex;
        uint256 highestBidRate = type(uint256).min;

        for (uint256 i = 0; i < activeBids.length; i++) {
            if (activeBids[i].rate > highestBidRate) {
                highestBidRate = activeBids[i].rate;
                highestBidIndex = i;
            }
        }

        Bid storage highestBid = activeBids[highestBidIndex];

        if (highestBid.amount < _amount) revert InsufficientDepth();

        Loan memory loan = Loan({
            id: loanId,
            lender: msg.sender,
            borrower: highestBid.borrower,
            token: _token,
            term: _term,
            amount: _amount,
            rate: highestBidRate,
            startDate: block.timestamp,
            endDate: block.timestamp + (_term * 1 days),
            repaymentAmount: (_amount * highestBidRate * _term) / (10000 * 365)
        });

        loans[msg.sender][loanId] = loan;
        loans[highestBid.borrower][loanId] = loan;
        loanIds[msg.sender].push(loanId);
        loanIds[highestBid.borrower].push(loanId);

        loanId += 1;

        if (highestBid.amount == _amount) {
            // remove the lowest ask
            activeBids[highestBidIndex] = activeBids[activeBids.length - 1];
            activeBids.pop();
        } else {
            // decrement the amount of the lowest ask
            highestBid.amount -= _amount;
        }

        deposits[msg.sender][_token] -= _amount;

        emit MarketAsk({
            lender: msg.sender,
            borrower: highestBid.borrower,
            token: _token,
            term: _term,
            amount: _amount,
            rate: highestBidRate
        });
    }

    function limitBid(
        address _token,
        uint256 _amount,
        uint256 _term,
        uint256 _rate
    ) public {
        if (_amount <= 0) revert InsufficientDepth();
        if (_rate <= 0 || _rate > 10000) revert RateOutOfBounds();

        if (deposits[msg.sender][_token] <= 0) revert CollateralAmountIsZero();
        if (deposits[msg.sender][_token] < (_amount * 100) / LTV)
            revert CollateralAmountTooLittle();

        deposits[msg.sender][_token] -= (_amount * 100) / LTV;

        bids[_token][_term].push(
            Bid({
                id: loanId,
                borrower: msg.sender,
                amount: _amount,
                rate: _rate,
                time: block.timestamp
            })
        );

        bidIds[msg.sender].push(loanId);

        loanId += 1;
    }

    function limitAsk(
        address _token,
        uint256 _amount,
        uint256 _term,
        uint256 _rate
    ) public {
        if (_amount <= 0) revert InsufficientDepth();
        if (_rate <= 0 || _rate > 10000) revert RateOutOfBounds();

        if (deposits[msg.sender][_token] <= 0) revert CollateralAmountIsZero();
        if (deposits[msg.sender][_token] < _amount)
            revert CollateralAmountTooLittle();

        deposits[msg.sender][_token] -= _amount;

        asks[_token][_term].push(
            Ask({
                id: loanId,
                lender: msg.sender,
                amount: _amount,
                rate: _rate,
                time: block.timestamp
            })
        );

        askIds[msg.sender].push(loanId);

        loanId += 1;
    }

    function deposit(address _token, uint256 _amount) public {
        if (_amount <= 0) revert DepositAmountIsZero();

        IERC20 token = IERC20(_token);

        uint256 allowance = token.allowance(msg.sender, address(this));
        if (allowance < _amount) revert InsufficentTokenAllowance();

        if (token.balanceOf(msg.sender) < _amount)
            revert InsufficentTokenBalance();

        bool isTransferred = token.transferFrom(
            msg.sender,
            address(this),
            _amount
        );

        if (!isTransferred) revert TransferFailed();

        deposits[msg.sender][_token] += _amount;
    }

    // TODO:
    function repay() public {}

    // TODO:
    function liquidate(address oracleAddress) public {
        IChronicle chronicle = IChronicle(oracleAddress);
        uint256 oraclePrice = chronicle.read();
    }

    function getBids(
        address _token,
        uint256 _term
    ) public view returns (Bid[] memory) {
        return bids[_token][_term];
    }

    function getAsks(
        address _token,
        uint256 _term
    ) public view returns (Ask[] memory) {
        return asks[_token][_term];
    }

    function getBidIds(address _sender) public view returns (uint[] memory) {
        return bidIds[_sender];
    }

    function getAskIds(address _sender) public view returns (uint[] memory) {
        return askIds[_sender];
    }
}
