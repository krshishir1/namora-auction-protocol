"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Auction } from "@/store/domainStore";
import { DollarSign, Clock, TrendingUp } from "lucide-react";
import { formatEther } from "viem";

import { intervalToDuration } from 'date-fns';

interface PlaceBidModalProps {
  auction: Auction;
  onBidPlace: (bidAmount: string) => void;
  children: React.ReactNode;
}

export default function PlaceBidModal({ 
  auction, 
  onBidPlace, 
  children 
}: PlaceBidModalProps) {
  const [open, setOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");

  const minBid = parseFloat(formatEther(BigInt(auction.highestBid))) + 0.001; // Minimum bid is current highest + 0.001 ETH
  const timeLeft = auction.endTime - Date.now();
  const isActive = timeLeft > 0 && auction.status === 'active';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount || parseFloat(bidAmount) < minBid) return;

    onBidPlace(bidAmount);
    
    setOpen(false);
    setBidAmount("");
  };

  const formatTimeLeft = (ms: number) => {    
    if (ms <= 0) return "Ended";
    
    const duration = intervalToDuration({
      start: 0, 
      end: timeLeft, // milliseconds remaining
    });
    const { hours, minutes } = duration;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Place Bid on {auction.domain.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Place your bid for this domain auction. Your bid must be higher than the current highest bid.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Auction Details</h4>
            <div className="space-y-1 text-sm text-gray-400">
              <p>Domain: <span className="text-white">{auction.domain.name}</span></p>
              <p>Current Highest Bid: <span className="text-white">{formatEther(BigInt(auction.highestBid))} ETH</span></p>
              <p>Reserve Price: <span className="text-white">{formatEther(BigInt(auction.reservePrice))} ETH</span></p>
              <p>Time Left: <span className="text-white">{formatTimeLeft(timeLeft)}</span></p>
              <p>Status: <span className={`font-medium ${isActive ? 'text-green-400' : 'text-red-400'}`}>
                {isActive ? 'Active' : 'Ended'}
              </span></p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bidAmount" className="text-gray-300 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Your Bid Amount (ETH)
            </Label>
            <Input
              id="bidAmount"
              type="number"
              step="0.001"
              min={minBid}
              placeholder={minBid.toString()}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
            <p className="text-xs text-gray-400">
              Minimum bid: {minBid} ETH
            </p>
          </div>

          {!isActive && (
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
              <p className="text-red-400 text-sm">
                This auction has ended and is no longer accepting bids.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isActive || !bidAmount || parseFloat(bidAmount) < minBid}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              Place Bid
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
