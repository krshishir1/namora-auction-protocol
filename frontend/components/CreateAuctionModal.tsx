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
import { Domain } from "@/store/domainStore";
import { Calendar, Clock, DollarSign } from "lucide-react";

interface CreateAuctionModalProps {
  domain: Domain;
  onAuctionCreate: (auctionData: {
    reservePrice: string;
    duration: number; // in hours
  }) => void;
  children: React.ReactNode;
}

export default function CreateAuctionModal({ 
  domain, 
  onAuctionCreate, 
  children 
}: CreateAuctionModalProps) {
  const [open, setOpen] = useState(false);
  const [reservePrice, setReservePrice] = useState("");
  const [duration, setDuration] = useState("24");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservePrice || !duration) return;

    onAuctionCreate({
      reservePrice,
      duration: parseInt(duration)
    });
    
    setOpen(false);
    setReservePrice("");
    setDuration("24");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-400" />
            Create Auction for {domain.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Set up an auction for your domain. Once created, bidders can place bids on your domain.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reservePrice" className="text-gray-300 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Reserve Price (ETH)
            </Label>
            <Input
              id="reservePrice"
              type="number"
              step="0.001"
              min="0"
              placeholder="0.1"
              value={reservePrice}
              onChange={(e) => setReservePrice(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-gray-300 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Auction Duration (hours)
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="168"
              placeholder="24"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>

          <div className="bg-gray-800/50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Auction Summary</h4>
            <div className="space-y-1 text-sm text-gray-400">
              <p>Domain: <span className="text-white">{domain.name}</span></p>
              <p>Reserve Price: <span className="text-white">{reservePrice || "0"} ETH</span></p>
              <p>Duration: <span className="text-white">{duration} hours</span></p>
              <p>End Time: <span className="text-white">
                {duration ? new Date(Date.now() + parseInt(duration) * 60 * 60 * 1000).toLocaleString() : "N/A"}
              </span></p>
            </div>
          </div>

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
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Create Auction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
