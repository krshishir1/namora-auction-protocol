import { Shield, Lock, Zap, Globe } from "lucide-react";

const TrustProtocol = () => {
  const features = [
    {
      icon: Shield,
      title: "Decentralized Security",
      description: "Built on blockchain technology ensuring transparent and tamper-proof auction processes."
    },
    {
      icon: Lock,
      title: "Automated Escrow",
      description: "Smart contracts handle all transactions automatically, eliminating the need for intermediaries."
    },
    {
      icon: Zap,
      title: "Instant Settlement",
      description: "Winners receive domain ownership immediately upon auction completion through automated protocols."
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Participate from anywhere in the world with just a Web3 wallet and internet connection."
    }
  ];

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powered by{" "}
            <span className="domain-glow">Doma Protocol</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the future of domain auctions with our cutting-edge protocol that ensures 
            security, transparency, and automation at every step of your bidding journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-effect p-8 rounded-2xl group hover:border-primary/50 transition-smooth"
              >
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6 group-hover:glow-green transition-glow">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span>Audited Smart Contracts</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Lock className="w-5 h-5 text-primary" />
              <span>Non-Custodial</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-primary" />
              <span>Gas Optimized</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            All transactions are secured by blockchain technology and processed through battle-tested 
            smart contracts audited by leading security firms.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustProtocol;