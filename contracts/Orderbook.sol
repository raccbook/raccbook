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
    mapping(address => uint256) public creditScore;
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
        if (
            deposits[msg.sender][_token] <
            (_amount * 100) / (LTV + creditScore[msg.sender])
        ) revert CollateralAmountTooLittle();

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

        deposits[msg.sender][_token] -=
            (_amount * 100) /
            (LTV + creditScore[msg.sender]);

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
        if (
            deposits[msg.sender][_token] <
            (_amount * 100) / (LTV + creditScore[msg.sender])
        ) revert CollateralAmountTooLittle();

        deposits[msg.sender][_token] -=
            (_amount * 100) /
            (LTV + creditScore[msg.sender]);

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

    function repay(uint256 _id) public {
        Loan memory loan = loans[msg.sender][_id];

        if (loan.id != _id) revert LoanDoesNotExist();

        if (loan.borrower != msg.sender) revert OnlyLoanBorrowerCanRepay();

        IERC20 token = IERC20(loan.token);

        if (token.balanceOf(msg.sender) < loan.amount + loan.repaymentAmount)
            revert InsufficentRepaymentAmount();

        bool isTransferred = token.transfer(
            address(this),
            loan.amount + loan.repaymentAmount
        );

        if (!isTransferred) revert TransferFailed();

        delete loans[msg.sender][_id];
        delete loans[loan.lender][_id];

        deposits[msg.sender][loan.token] +=
            ((loan.amount * 100) / (LTV + creditScore[msg.sender])) -
            loan.repaymentAmount;
        deposits[loan.lender][loan.token] += loan.amount + loan.repaymentAmount;

        uint[] storage borrowerLoanIds = loanIds[msg.sender];

        for (uint256 i = 0; i < borrowerLoanIds.length; i++) {
            if (borrowerLoanIds[i] == _id) {
                borrowerLoanIds[i] = borrowerLoanIds[
                    borrowerLoanIds.length - 1
                ];
                borrowerLoanIds.pop();
                break;
            }
        }

        uint[] storage lenderLoanIds = loanIds[loan.lender];

        for (uint256 i = 0; i < lenderLoanIds.length; i++) {
            if (lenderLoanIds[i] == _id) {
                lenderLoanIds[i] = lenderLoanIds[lenderLoanIds.length - 1];
                lenderLoanIds.pop();
                break;
            }
        }
    }

    function liquidate(
        address _token,
        uint256 _loanId,
        address _oracleAddress
    ) public {
        IChronicle chronicle = IChronicle(_oracleAddress);
        IERC20 token = IERC20(_token);

        uint256 oraclePrice = chronicle.read();
        Loan storage loan = loans[_token][_loanId];

        uint256 totalBorrowValue = loan.amount * oraclePrice;
        uint256 totalCollateralValue = deposits[loan.borrower][_token] *
            oraclePrice;

        if (
            (totalCollateralValue * 100) / totalBorrowValue <
            (LTV + creditScore[msg.sender])
        ) revert NoLiquidationPossible();

        uint256 amountToLiquidate = (loan.amount *
            (LTV + creditScore[msg.sender])) / 100;

        require(
            token.balanceOf(msg.sender) >= amountToLiquidate,
            "Insufficient liquidation balance"
        );

        require(
            token.transferFrom(msg.sender, address(this), amountToLiquidate),
            "Token transfer failed"
        );

        deposits[loan.borrower][_token] -= amountToLiquidate;

        require(
            token.transfer(msg.sender, (amountToLiquidate * (100 - LTV)) / 100),
            "Token transfer failed"
        );
    }

    function liquidateDemo(uint256 _id) public {
        Loan memory loan = loans[msg.sender][_id];

        if (loan.id != _id) revert LoanDoesNotExist();

        delete loans[msg.sender][_id];
        delete loans[loan.lender][_id];

        uint[] storage borrowerLoanIds = loanIds[msg.sender];

        for (uint256 i = 0; i < borrowerLoanIds.length; i++) {
            if (borrowerLoanIds[i] == _id) {
                borrowerLoanIds[i] = borrowerLoanIds[
                    borrowerLoanIds.length - 1
                ];
                borrowerLoanIds.pop();
                break;
            }
        }

        uint[] storage lenderLoanIds = loanIds[loan.lender];

        for (uint256 i = 0; i < lenderLoanIds.length; i++) {
            if (lenderLoanIds[i] == _id) {
                lenderLoanIds[i] = lenderLoanIds[lenderLoanIds.length - 1];
                lenderLoanIds.pop();
                break;
            }
        }
    }

    function setCreditScore(uint256 _score) public {
        creditScore[msg.sender] = _score;
    }

    function paySubscription(address _token) public {
        IERC20 token = IERC20(_token);

        bool isTransferred = token.transferFrom(
            msg.sender,
            address(this),
            5 ether
        );

        if (!isTransferred) revert TransferFailed();
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

    function getLoanIds(address _sender) public view returns (uint[] memory) {
        return loanIds[_sender];
    }
}
