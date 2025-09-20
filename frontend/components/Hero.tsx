import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  const scrollingDomains = [
    "crypto.eth", "ai.com", "blockchain.xyz", "web3.io", "defi.org",
    "nft.world", "meta.space", "future.tech", "digital.life", "smart.city"
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/hero-bg.jpg)` }}
      />
      <div className="absolute inset-0 bg-background opacity-90" />
      
      {/* Scrolling domains animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full animate-pulse">
          <div className="flex space-x-8 animate-[scroll_30s_linear_infinite]">
            {scrollingDomains.map((domain, index) => (
              <span
                key={index}
                className="text-2xl font-bold text-primary/30 whitespace-nowrap"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-primary mr-3" />
          <span className="text-lg text-muted-foreground font-medium">
            Powered by Doma Protocol
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
          Own the{" "}
          <span className="domain-glow">
            Future
          </span>{" "}
          of Domains
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Secure premium domain names through transparent English auctions. 
          Decentralized, automated, and built for the future of web ownership.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button className="btn-hero group">
            Start Bidding
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button variant="outline" className="btn-ghost">
            Explore Auctions
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">2,547</div>
            <div className="text-muted-foreground">Domains Sold</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">$12.4M</div>
            <div className="text-muted-foreground">Total Volume</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">48</div>
            <div className="text-muted-foreground">Live Auctions</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;