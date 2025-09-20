import { Wallet, Gavel, Trophy } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Wallet,
      title: "Connect Wallet",
      description: "Link your MetaMask or preferred Web3 wallet to participate in auctions securely.",
      step: "01"
    },
    {
      icon: Gavel,
      title: "Join English Auction",
      description: "Browse live auctions and place your bids on premium domain names with transparent pricing.",
      step: "02"
    },
    {
      icon: Trophy,
      title: "Win Premium Names",
      description: "Highest bid at auction end wins. Automated transfers via Doma Protocol ensure security.",
      step: "03"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to own the future of premium domains through our decentralized auction platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="auction-card text-center group relative overflow-hidden"
              >
                {/* Step number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                  {step.step}
                </div>
                
                {/* Icon */}
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6 group-hover:glow-green transition-glow">
                <Icon className="w-7 h-7 text-primary-foreground" />
              </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-border transform -translate-y-1/2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;