// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/IDoma.sol";

contract DomaDomainAuction is ReentrancyGuard {
    struct Auction {
        uint256 tokenId;
        address seller;
        uint256 startTime;
        uint256 endTime;
        uint256 reservePrice;    // minimal bid in wei
        uint256 minIncrement;    // minimum increment
        bool settled;
        address highestBidder;
        uint256 highestBid;
        string domainName;       // human-readable domain name
    }

    uint256 public nextAuctionId = 1;
    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256) public pendingWithdrawals;
    // Index auctions by tokenId for easy lookup
    mapping(uint256 => uint256[]) public tokenIdToAuctionIds;
    mapping(uint256 => mapping(address => uint256)) public userBids; // auctionId => user => bid amount
    // Index auctions by domain name (hashed) for easy lookup
    mapping(bytes32 => uint256[]) public domainToAuctionIds;

    event AuctionCreated(
        uint256 indexed auctionId,
        address seller,
        uint256 tokenId,
        string domainName,
        uint256 startTime,
        uint256 endTime,
        uint256 reservePrice
    );
    event BidPlaced(uint256 indexed auctionId, uint256 tokenId, string domainName, address bidder, uint256 amount);
    event AuctionSettled(uint256 indexed auctionId, address winner, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    IERC721Minimal tokenContract;

    constructor(address _tokenContract) {
        tokenContract = IERC721Minimal(_tokenContract);
    }

    /** 
     * Create auction for a Doma tokenized domain NFT
     */
    function createAuction(
        uint256 _tokenId,
        string calldata _domainName,
        uint256 _durationSeconds,
        uint256 _reservePrice,
        uint256 _minIncrement
    ) external nonReentrant returns (uint256) {
        require(_durationSeconds > 0, "duration > 0");
        require(_minIncrement > 0, "minIncrement > 0");

        require(tokenContract.ownerOf(_tokenId) == msg.sender, "not NFT owner");

        uint256 auctionId = nextAuctionId++;
        uint256 startTime = block.timestamp;
        auctions[auctionId] = Auction({
            tokenId: _tokenId,
            seller: msg.sender,
            startTime: startTime,
            endTime: startTime + _durationSeconds,
            reservePrice: _reservePrice,
            minIncrement: _minIncrement,
            settled: false,
            highestBidder: address(0),
            highestBid: 0,
            domainName: _domainName
        });

        // index by tokenId
        tokenIdToAuctionIds[_tokenId].push(auctionId);
        // index by domain name
        domainToAuctionIds[keccak256(bytes(_domainName))].push(auctionId);

        emit AuctionCreated(auctionId, msg.sender, _tokenId, _domainName, startTime, startTime + _durationSeconds, _reservePrice);
        return auctionId;
    }

    /**
     * Get all auctionIds created for a given tokenId
     */
    function getAuctionsByTokenId(uint256 _tokenId) external view returns (uint256[] memory) {
        return tokenIdToAuctionIds[_tokenId];
    }

    /**
     * Get the latest (most recently created) auctionId for a tokenId, if any
     */
    function getLatestAuctionIdByTokenId(uint256 _tokenId) external view returns (bool found, uint256 auctionId) {
        uint256 len = tokenIdToAuctionIds[_tokenId].length;
        if (len == 0) {
            return (false, 0);
        }
        return (true, tokenIdToAuctionIds[_tokenId][len - 1]);
    }

    /**
     * Get all auctionIds created for a given domain name
     */
    function getAuctionsByDomainName(string calldata _domainName) external view returns (uint256[] memory) {
        return domainToAuctionIds[keccak256(bytes(_domainName))];
    }

    /**
     * Get latest auctionId for domain name, if any
     */
    function getLatestAuctionIdByDomainName(string calldata _domainName) external view returns (bool found, uint256 auctionId) {
        bytes32 key = keccak256(bytes(_domainName));
        uint256 len = domainToAuctionIds[key].length;
        if (len == 0) {
            return (false, 0);
        }
        return (true, domainToAuctionIds[key][len - 1]);
    }

    

    /** Place a bid */
    // place bid : 0.01 WETH
    // new offers => tokenId
    function placeBid(uint256 auctionId, uint256 amount) external payable nonReentrant {
        Auction storage a = auctions[auctionId];
        require(block.timestamp >= a.startTime && block.timestamp < a.endTime, "auction not active");
        require(msg.value == 0.001 ether, "bid rate must be 0.001 ETH");

        uint256 minBid = a.highestBid == 0 ? a.reservePrice : a.highestBid + a.minIncrement;
        require(amount >= minBid, "bid value must be more");

        // Track user's bid amount for this auction
        userBids[auctionId][msg.sender] = amount;

        // Update highest bid and bidder
        a.highestBid = amount;
        a.highestBidder = msg.sender;

        emit BidPlaced(auctionId, a.tokenId, a.domainName, msg.sender, msg.value);
    }

    /** Get user's bid amount for a specific auction */
    function getUserBidAmount(uint256 auctionId, address user) external view returns (uint256) {
        return userBids[auctionId][user];
    }

    /** Withdraw overbid funds */
    function withdraw() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "no funds");
        pendingWithdrawals[msg.sender] = 0;
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "withdraw failed");
        emit Withdrawal(msg.sender, amount);
    }

     /**
     * Settle an auction after it has ended.
     * Transfers domain to winner (if tokenized) and sends funds to seller.
     * Anyone can call. If no bids, seller can reclaim the token.
     */
    function settleAuction(uint256 auctionId) external nonReentrant {
        Auction storage a = auctions[auctionId];
        require(block.timestamp >= a.endTime, "not ended");
        require(!a.settled, "already settled");
        a.settled = true;

        if (a.highestBidder == address(0)) {
            // no bids, return NFT to seller
            // IERC721(a.tokenContract).transferFrom(address(this), a.seller, a.tokenId);
            return;
        }

        // transfer NFT to winner
        // IERC721(a.tokenContract).transferFrom(address(this), a.highestBidder, a.tokenId);

        // send funds to seller
        (bool sent, ) = payable(a.seller).call{value: a.highestBid}("");
        if (!sent) {
            pendingWithdrawals[a.seller] += a.highestBid;
        }

        emit AuctionSettled(auctionId, a.highestBidder, a.highestBid);
    }
}
