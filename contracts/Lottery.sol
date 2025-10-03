// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LotteryContract is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable WETH;
    uint256 public ticketPrice;
    uint256 public startTime;
    uint256 public endTime;

    address[] private tickets;     // each entry = one ticket, stores buyer addresses
    mapping(address => uint256) public ticketsPerUser;

    bool public winnerSelected;
    address public winner;

    event TicketsBought(address indexed buyer, uint256 count);
    event WinnerSelected(address indexed winner, uint256 index);
    event PrizeClaimed(address indexed winner, uint256 amount);

    constructor(
        address _weth,
        uint256 _ticketPrice,
        uint256 _startTime,
        uint256 _endTime
    ) Ownable(msg.sender) {
        require(_weth != address(0), "WETH address zero");
        require(_startTime < _endTime, "start >= end");
        WETH = IERC20(_weth);
        ticketPrice = _ticketPrice;
        startTime = _startTime;
        endTime = _endTime;
    }

    modifier duringSale() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "not in sale window");
        _;
    }

    function buyTickets(uint256 count) external nonReentrant duringSale {
        require(count > 0, "count 0");
        uint256 total = ticketPrice * count;
        // Transfer WETH from buyer to contract (buyer must approve first)
        WETH.safeTransferFrom(msg.sender, address(this), total);

        for (uint256 i = 0; i < count; i++) {
            tickets.push(msg.sender);
        }
        ticketsPerUser[msg.sender] += count;

        emit TicketsBought(msg.sender, count);
    }

    /// @notice Quick helper for number of tickets sold
    function ticketsCount() external view returns (uint256) {
        return tickets.length;
    }

    /// @notice Draw a winner after endTime. Uses insecure onchain randomness.
    function drawWinner() external nonReentrant {
        require(block.timestamp > endTime, "sale still active");
        require(!winnerSelected, "already selected");
        require(tickets.length > 0, "no tickets");

        uint256 rand = uint256(
            keccak256(
                abi.encodePacked(
                    blockhash(block.number - 1),
                    block.timestamp,
                    tickets.length
                )
            )
        );

        uint256 idx = rand % tickets.length;
        winner = tickets[idx];
        winnerSelected = true;

        emit WinnerSelected(winner, idx);
    }

    /// @notice Winner claims WETH prize (all WETH in contract)
    function claimPrize() external nonReentrant {
        require(winnerSelected, "winner not selected");
        require(msg.sender == winner, "not winner");
        uint256 bal = WETH.balanceOf(address(this));
        require(bal > 0, "no prize");

        WETH.safeTransfer(winner, bal);
        emit PrizeClaimed(winner, bal);
    }

    /* === Admin helpers === */

    function setTimes(uint256 _start, uint256 _end) external onlyOwner {
        require(_start < _end, "start >= end");
        startTime = _start;
        endTime = _end;
    }

    function setTicketPrice(uint256 _price) external onlyOwner {
        ticketPrice = _price;
    }

    /// @notice emergency withdraw by owner (use with care)
    function emergencyWithdraw(address to, uint256 amount) external onlyOwner {
        WETH.safeTransfer(to, amount);
    }

    /// @notice get tickets for a user (linear scan — not gas efficient for large arrays)
    function ticketsOf(address user) external view returns (uint256) {
        return ticketsPerUser[user];
    }
}
