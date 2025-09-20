"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Eye, Search, Filter } from "lucide-react";

const Auctions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const auctions = [
    {
      id: 1,
      domain: "crypto.com",
      currentBid: "125.5 ETH",
      timeLeft: "2h 34m",
      bidders: 23,
      trending: true,
      status: "live",
      category: "Finance"
    },
    {
      id: 2,
      domain: "ai.io",
      currentBid: "89.2 ETH",
      timeLeft: "4h 12m",
      bidders: 17,
      trending: false,
      status: "live",
      category: "Technology"
    },
    {
      id: 3,
      domain: "web3.org",
      currentBid: "156.8 ETH",
      timeLeft: "1h 45m",
      bidders: 31,
      trending: true,
      status: "ending-soon",
      category: "Technology"
    },
    {
      id: 4,
      domain: "blockchain.app",
      currentBid: "73.4 ETH",
      timeLeft: "6h 28m",
      bidders: 12,
      trending: false,
      status: "live",
      category: "Technology"
    },
    {
      id: 5,
      domain: "defi.world",
      currentBid: "198.1 ETH",
      timeLeft: "3h 56m",
      bidders: 28,
      trending: true,
      status: "live",
      category: "Finance"
    },
    {
      id: 6,
      domain: "nft.space",
      currentBid: "45.7 ETH",
      timeLeft: "5h 15m",
      bidders: 19,
      trending: false,
      status: "live",
      category: "Art"
    },
    {
      id: 7,
      domain: "gaming.xyz",
      currentBid: "67.3 ETH",
      timeLeft: "8h 42m",
      bidders: 15,
      trending: false,
      status: "live",
      category: "Gaming"
    },
    {
      id: 8,
      domain: "meta.tech",
      currentBid: "112.9 ETH",
      timeLeft: "12h 18m",
      bidders: 21,
      trending: true,
      status: "live",
      category: "Technology"
    }
  ];

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || auction.status === filter || auction.category.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ending-soon":
        return <Badge variant="destructive">Ending Soon</Badge>;
      case "live":
        return <Badge className="bg-primary text-primary-foreground">Live</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Live Domain Auctions
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover and bid on premium domains across all categories
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search domains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="h-12"
            >
              All
            </Button>
            <Button
              variant={filter === "ending-soon" ? "default" : "outline"}
              onClick={() => setFilter("ending-soon")}
              className="h-12"
            >
              Ending Soon
            </Button>
            <Button
              variant={filter === "technology" ? "default" : "outline"}
              onClick={() => setFilter("technology")}
              className="h-12"
            >
              Tech
            </Button>
            <Button
              variant={filter === "finance" ? "default" : "outline"}
              onClick={() => setFilter("finance")}
              className="h-12"
            >
              Finance
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="auction-card text-center">
            <div className="text-2xl font-bold text-primary">{auctions.length}</div>
            <div className="text-sm text-muted-foreground">Total Auctions</div>
          </div>
          <div className="auction-card text-center">
            <div className="text-2xl font-bold text-primary">
              {auctions.filter(a => a.status === "ending-soon").length}
            </div>
            <div className="text-sm text-muted-foreground">Ending Soon</div>
          </div>
          <div className="auction-card text-center">
            <div className="text-2xl font-bold text-primary">
              {auctions.reduce((sum, a) => sum + a.bidders, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Bidders</div>
          </div>
          <div className="auction-card text-center">
            <div className="text-2xl font-bold text-primary">847.3</div>
            <div className="text-sm text-muted-foreground">ETH Volume</div>
          </div>
        </div>

        {/* Auctions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAuctions.map((auction) => (
            <div key={auction.id} className="auction-card group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold domain-glow mb-1">
                    {auction.domain}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                    <Eye className="w-4 h-4" />
                    <span>{auction.bidders} bidders</span>
                    {auction.trending && (
                      <>
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-primary">Hot</span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(auction.status)}
                    <Badge variant="outline" className="text-xs">
                      {auction.category}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Current bid */}
              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-1">Current Bid</div>
                <div className="text-2xl font-bold text-primary">
                  {auction.currentBid}
                </div>
              </div>

              {/* Time left */}
              <div className="flex items-center justify-between mb-6">
                <div className="countdown">
                  <Clock className="w-4 h-4 inline mr-2" />
                  {auction.timeLeft}
                </div>
              </div>

              {/* Action */}
              <Button className="w-full bg-primary text-primary-foreground hover:glow-green transition-glow">
                View Auction
              </Button>
            </div>
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No auctions found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auctions;