"use client";

import { Auction, Bid } from "@/store/domainStore";
import { Trophy, Clock, User } from "lucide-react";
import { formatEther } from "viem";

interface BidsLeaderboardProps {
  auction: Auction;
}

export default function BidsLeaderboard({ auction }: BidsLeaderboardProps) {
  // Sort bids by amount (highest first)
  const sortedBids = [...auction.bids].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-4 w-4 text-yellow-400" />;
      case 1:
        return <Trophy className="h-4 w-4 text-gray-400" />;
      case 2:
        return <Trophy className="h-4 w-4 text-amber-600" />;
      default:
        return <span className="text-gray-400 font-medium">#{index + 1}</span>;
    }
  };

  if (sortedBids.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Bids Leaderboard
        </h3>
        <div className="text-center py-8">
          <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-400">No bids placed yet</p>
          <p className="text-sm text-gray-500 mt-1">Be the first to place a bid!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-400" />
        Bids Leaderboard
      </h3>
      
      <div className="space-y-3">
        {sortedBids.map((bid, index) => (
          <div
            key={bid.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              bid.isHighest
                ? 'bg-green-900/20 border-green-500/30'
                : 'bg-gray-700/30 border-gray-600/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8">
                {getRankIcon(index)}
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-white font-medium">
                  {formatAddress(bid.bidder)}
                </span>
                {bid.isHighest && (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Highest
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-white font-semibold">
                {bid.amount} ETH
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                {formatTime(bid.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Total Bids: {sortedBids.length}</span>
          <span>Highest Bid: {formatEther(BigInt(auction.highestBid))} ETH</span>
        </div>
      </div>
    </div>
  );
}
