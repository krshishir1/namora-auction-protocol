import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Eye } from "lucide-react";

const LiveAuctions = () => {
  const auctions = [
    {
      domain: "crypto.com",
      currentBid: "125.5 ETH",
      timeLeft: "2h 34m",
      bidders: 23,
      trending: true
    },
    {
      domain: "ai.io",
      currentBid: "89.2 ETH",
      timeLeft: "4h 12m",
      bidders: 17,
      trending: false
    },
    {
      domain: "web3.org",
      currentBid: "156.8 ETH",
      timeLeft: "1h 45m",
      bidders: 31,
      trending: true
    },
    {
      domain: "blockchain.app",
      currentBid: "73.4 ETH",
      timeLeft: "6h 28m",
      bidders: 12,
      trending: false
    },
    {
      domain: "defi.world",
      currentBid: "198.1 ETH",
      timeLeft: "3h 56m",
      bidders: 28,
      trending: true
    },
    {
      domain: "nft.space",
      currentBid: "45.7 ETH",
      timeLeft: "5h 15m",
      bidders: 19,
      trending: false
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Live Auctions
            </h2>
            <p className="text-xl text-muted-foreground">
              Bid on premium domains ending soon
            </p>
          </div>
          
          <Button variant="outline" className="btn-ghost mt-6 md:mt-0">
            View All Auctions
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction, index) => (
            <div key={index} className="auction-card group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold domain-glow mb-1">
                    {auction.domain}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{auction.bidders} bidders</span>
                    {auction.trending && (
                      <>
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-primary">Trending</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Current bid */}
              <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-1">Current Bid</div>
                <div className="text-3xl font-bold text-primary">
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
                Place Bid
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveAuctions;