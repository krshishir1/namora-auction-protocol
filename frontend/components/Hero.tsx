"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, AlertTriangle, ExternalLink, Play } from "lucide-react";
import { useAccount } from "wagmi";
import { useAccountStore } from "@/store/accountStore";
import Link from "next/link";


const Hero = () => {
  const { isConnected, chain } = useAccount();
  const { account } = useAccountStore();
  
  const scrollingDomains = [
    "crypto.eth", "ai.com", "blockchain.xyz", "web3.io", "defi.org",
    "nft.world", "meta.space", "future.tech", "digital.life", "smart.city"
  ];

  const isSepoliaNetwork = chain?.id === 11155111;
  const showAlert = !isConnected || !isSepoliaNetwork;


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

        <h1 className="mt-24 text-6xl md:text-8xl font-bold mb-6 leading-tight">
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

        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-primary mr-3" />
          <span className="text-lg text-muted-foreground font-medium">
            Powered by Doma Protocol
          </span>
        </div>

        <div>
          {showAlert && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-amber-100/80 text-sm mb-3">
                    {!isConnected 
                      ? "Please connect your wallet in Sepolia network for domain auctions"
                      : "This application requires the Sepolia testnet. Please switch your network to continue."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

           {
             account?.address && (
               <div className="flex flex-col items-center gap-4 mb-16">
                 <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4 max-w-md mx-auto">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                     <span className="text-green-200 text-sm font-medium">
                       Wallet Connected to Sepolia
                     </span>
                   </div>
                 </div>
                 
                 <Link href="/app">
                   <Button 
                     size="lg" 
                     className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                   >
                     <Play className="w-5 h-5 mr-2" />
                     Enter Domain Auctions
                     <ArrowRight className="w-5 h-5 ml-2" />
                   </Button>
                 </Link>
                 
            
               </div>
             )
           }
        </div>
      </div>
    </section>
  );
};

export default Hero;