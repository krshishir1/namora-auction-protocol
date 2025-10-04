import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import LiveAuctions from "@/components/LiveAuctions";
import TrustProtocol from "@/components/TrustProtocol";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;