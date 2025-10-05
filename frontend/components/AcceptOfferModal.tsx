"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { formatEther } from "viem";
import { intervalToDuration } from "date-fns";

interface AcceptOfferModalProps {
  auction: any;
  onAcceptOffer: (auctionId: string) => Promise<void>;
  children: React.ReactNode;
}

export default function AcceptOfferModal({
  auction,
  onAcceptOffer,
  children,
}: AcceptOfferModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptOffer = async () => {
    setIsLoading(true);
    try {
      await onAcceptOffer(auction.id);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to accept offer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeLeft = (endTime: number) => {
    const now = Date.now();
    const diff = endTime - now;
    
    if (diff <= 0) return "Auction Ended";
    
    const duration = intervalToDuration({
      start: now,
      end: endTime,
    });
    
    const { hours, minutes } = duration;
    
    // if (days && days > 0) return `${days}d ${hours || 0}h ${minutes || 0}m`;
    if (hours && hours > 0) return `${hours}h ${minutes || 0}m`;
    return `${minutes || 0}m`;
  };

  const isAuctionEnded = auction.endTime <= Date.now();
  const hasBids = auction.bids && auction.bids.length > 0;
  const highestBid = auction.bids?.reduce((max: any, bid: any) => 
    parseFloat(bid.amount) > parseFloat(max.amount) ? bid : max, 
    auction.bids?.[0] || { amount: "0" }
  );
  const canAcceptOffer = isAuctionEnded && hasBids && highestBid;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Accept Highest Offer
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Review and accept the highest bid for your domain auction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Auction Status */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-white">Auction Status</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isAuctionEnded 
                  ? "bg-red-900/30 text-red-300 border border-red-500/30" 
                  : "bg-yellow-900/30 text-yellow-300 border border-yellow-500/30"
              }`}>
                {isAuctionEnded ? "Ended" : "Active"}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {isAuctionEnded ? "Auction has ended" : `Ends in ${formatTimeLeft(auction.endTime)}`}
              </span>
            </div>
          </div>

          {/* Highest Bid Details */}
          {hasBids && highestBid ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-4">Highest Bid</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Bid Amount</span>
                  </div>
                  <span className="text-white font-bold text-lg">
                    {highestBid.amount} ETH
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">Bidder</span>
                  </div>
                  <span className="text-white font-mono text-sm">
                    {highestBid.bidder.slice(0, 6)}...{highestBid.bidder.slice(-4)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-300">Bid Time</span>
                  </div>
                  <span className="text-white text-sm">
                    {new Date(highestBid.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <AlertTriangle className="h-4 w-4" />
                <span>No bids placed on this auction</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            
            {canAcceptOffer ? (
              <Button
                onClick={handleAcceptOffer}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Accepting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Accept Offer
                  </div>
                )}
              </Button>
            ) : (
              <Button
                disabled
                className="flex-1 bg-gray-600 text-gray-400 cursor-not-allowed"
              >
                {!isAuctionEnded ? "Auction Still Active" : "No Bids to Accept"}
              </Button>
            )}
          </div>

          {/* Warning Message */}
          {hasBids && highestBid && isAuctionEnded && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-yellow-300 text-sm">
                  <p className="font-medium mb-1">Important:</p>
                  <p>Accepting this offer will transfer the domain to the highest bidder and finalize the auction. This action cannot be undone.</p>
                </div>
              </div>
            </div>
          )}

          {/* Active Auction Message */}
          {!isAuctionEnded && hasBids && highestBid && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-blue-300 text-sm">
                  <p className="font-medium mb-1">Auction Still Active:</p>
                  <p>You can view the current highest bid, but you can only accept offers after the auction ends.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
