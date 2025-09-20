"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Wallet, Trophy, TrendingUp, Clock, Globe, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const userStats = {
    totalBids: 47,
    wins: 12,
    totalSpent: "156.8 ETH",
    success: "74%"
  };

  const ownedDomains = [
    { domain: "crypto.tech", acquired: "2024-01-15", value: "45.2 ETH", status: "owned" },
    { domain: "ai.world", acquired: "2024-02-08", value: "67.8 ETH", status: "owned" },
    { domain: "web3.app", acquired: "2024-02-20", value: "123.5 ETH", status: "owned" },
    { domain: "defi.space", acquired: "2024-03-01", value: "89.3 ETH", status: "owned" }
  ];

  const activeBids = [
    { domain: "blockchain.io", currentBid: "23.5 ETH", myBid: "25.0 ETH", timeLeft: "2h 45m", status: "leading" },
    { domain: "nft.global", currentBid: "45.2 ETH", myBid: "42.0 ETH", timeLeft: "4h 12m", status: "outbid" },
    { domain: "meta.finance", currentBid: "78.9 ETH", myBid: "78.9 ETH", timeLeft: "1h 33m", status: "leading" }
  ];

  const auctionHistory = [
    { domain: "crypto.tech", finalBid: "45.2 ETH", date: "2024-01-15", result: "won" },
    { domain: "ai.world", finalBid: "67.8 ETH", date: "2024-02-08", result: "won" },
    { domain: "gaming.xyz", finalBid: "34.5 ETH", date: "2024-02-15", result: "lost" },
    { domain: "web3.app", finalBid: "123.5 ETH", date: "2024-02-20", result: "won" }
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText("0x742d35Cc6638Bb614C3C8E0F55B8d7B5A8B9C123");
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "leading":
        return <Badge className="bg-primary text-primary-foreground">Leading</Badge>;
      case "outbid":
        return <Badge variant="destructive">Outbid</Badge>;
      case "won":
        return <Badge className="bg-primary text-primary-foreground">Won</Badge>;
      case "lost":
        return <Badge variant="secondary">Lost</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Profile Header */}
        <div className="auction-card mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                <User className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">Domain Collector</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground font-mono text-sm">
                  0x742d35...C123
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyAddress}
                  className="p-1 h-6 w-6"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userStats.totalBids}</div>
                  <div className="text-sm text-muted-foreground">Total Bids</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userStats.wins}</div>
                  <div className="text-sm text-muted-foreground">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userStats.totalSpent}</div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userStats.success}</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>

            <Button className="bg-primary text-primary-foreground">
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="domains">My Domains</TabsTrigger>
            <TabsTrigger value="bids">Active Bids</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="auction-card">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-primary" />
                  Recent Wins
                </h3>
                <div className="space-y-3">
                  {ownedDomains.slice(0, 3).map((domain, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-primary">{domain.domain}</div>
                        <div className="text-sm text-muted-foreground">{domain.acquired}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{domain.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="auction-card">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Active Bids
                </h3>
                <div className="space-y-3">
                  {activeBids.slice(0, 3).map((bid, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-primary">{bid.domain}</div>
                        <div className="text-sm text-muted-foreground">My bid: {bid.myBid}</div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(bid.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="domains" className="space-y-6">
            <div className="auction-card">
              <h3 className="text-xl font-bold mb-6">Owned Domains ({ownedDomains.length})</h3>
              <div className="grid gap-4">
                {ownedDomains.map((domain, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Globe className="w-8 h-8 text-primary" />
                      <div>
                        <div className="text-lg font-bold domain-glow">{domain.domain}</div>
                        <div className="text-sm text-muted-foreground">
                          Acquired: {domain.acquired}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{domain.value}</div>
                      <Badge className="bg-primary text-primary-foreground">Owned</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bids" className="space-y-6">
            <div className="auction-card">
              <h3 className="text-xl font-bold mb-6">Active Bids ({activeBids.length})</h3>
              <div className="grid gap-4">
                {activeBids.map((bid, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Globe className="w-8 h-8 text-primary" />
                      <div>
                        <div className="text-lg font-bold domain-glow">{bid.domain}</div>
                        <div className="text-sm text-muted-foreground">
                          Current: {bid.currentBid} | My bid: {bid.myBid}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="countdown mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {bid.timeLeft}
                      </div>
                      {getStatusBadge(bid.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="auction-card">
              <h3 className="text-xl font-bold mb-6">Auction History</h3>
              <div className="grid gap-4">
                {auctionHistory.map((auction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Globe className="w-8 h-8 text-primary" />
                      <div>
                        <div className="text-lg font-bold domain-glow">{auction.domain}</div>
                        <div className="text-sm text-muted-foreground">
                          Final bid: {auction.finalBid} | {auction.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(auction.result)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;