"use client";

import Header from "@/components/Header";
import { useAccountStore } from "@/store/accountStore";
import { useDomainStore } from "@/store/domainStore";
import { getDomainsFromAccounts } from "@/lib/domaApi";
import { useWalletClient } from "wagmi";
import { useEffect, useState } from "react";
import { getDomaOrderbookClient, OrderbookType } from "@doma-protocol/orderbook-sdk";
import { tokenContractAddress, tokenCurrencyAddress } from "@/lib/doma";
import { parseEther } from "viem";
import { Button } from "@/components/ui/button";
import { Clock, Globe, Building, Network, Eye } from "lucide-react";
import Link from "next/link";

function shortenText(text: string) {
    const str = text.toString();
    if (str.length <= 10) return str;
    return str.slice(0, 5) + "..." + str.slice(-5);
  }

export default function TestPage() {
    const {chain, account, signer} = useAccountStore()
    const { data: walletClient } = useWalletClient();
    const { domains } = useDomainStore();
    const [timeLeft, setTimeLeft] = useState<{[key: string]: string}>({});

    // Countdown timer effect
    useEffect(() => {
        const updateCountdowns = () => {
            const newTimeLeft: {[key: string]: string} = {};
            domains.forEach(domain => {
                const expiry = new Date(domain.expiresAt).getTime();
                const now = Date.now();
                const diff = expiry - now;
                
                if (diff > 0) {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    newTimeLeft[domain.name] = `${days}d ${hours}h ${minutes}m`;
                } else {
                    newTimeLeft[domain.name] = "Expired";
                }
            });
            setTimeLeft(newTimeLeft);
        };

        updateCountdowns();
        const interval = setInterval(updateCountdowns, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [domains]);

    useEffect(() => {
        async function getDomaDetails() {
            try {
                useDomainStore.setState({loading: true})
                const domainsData = await getDomainsFromAccounts([account?.address]);
                console.log(domainsData)
                if (domainsData) {
                    useDomainStore.setState({domains: domainsData})
                }
            } catch (error) {
                useDomainStore.setState({error: error instanceof Error ? error.message : 'Failed to fetch domains'})
            } finally {
                useDomainStore.setState({loading: false})
            }
        }

        if(account) {
            getDomaDetails()
        }
    }, [account])

    // Generate random domain logo
    const getDomainLogo = (domainName: string) => {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-pink-500'];
        const colorIndex = domainName.length % colors.length;
        return colors[colorIndex];
    };

    // Create auction function
    const createAuction = (domain: any) => {
        console.log('Creating auction for:', domain.name);
        // TODO: Implement auction creation logic
    };

    // Create offer function
    const handleCreateOffer = async (domain: any) => {

        if (domain.tokens.length === 0) {
            alert("No token found for this domain");
            return;
        }

        try {
            await createOffer(domain.tokens[0].tokenId, 0.001);
        } catch (error) {
            console.error("Error creating offer:", error);
            alert("Failed to create offer");
        }
    };

    // amount will be in eth
    async function createOffer(tokenId: string, amount: number) {
        if(!signer) return alert("Signer not present");

        const client = await getDomaOrderbookClient()

        const offerResult = await client.createOffer({
            params: {
              items: [
                {
                  contract: tokenContractAddress.sepolia,
                  tokenId,
                  currencyContractAddress: tokenCurrencyAddress.sepolia_weth, 
                  price: parseEther(amount.toString()).toString(),
                },
              ],
              orderbook: OrderbookType.DOMA,
              expirationTime: Math.floor(Date.now() / 1000) + 86400, // 24 hours
            },
            signer,
            chainId: `eip155:${chain?.id}`,
            onProgress: (step, progress) => {
              console.log(`Creating offer: ${step} (${progress}%)`);
            },
          });

        console.log(offerResult)  
    }

  return (
    <>
      <Header />

      <div className="container pt-48 text-gray-100">
        <h1 className="text-3xl font-bold mb-8">
          Domain Management Dashboard
        </h1>

        {domains.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400">No domains found. Connect your wallet to view your domains.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain) => (
              <div key={domain.name} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300">
                {/* Domain Logo */}
                <div className={`w-16 h-16 ${getDomainLogo(domain.name)} rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4`}>
                  {domain.name.charAt(0).toUpperCase()}
                </div>

                {/* Domain Name */}
                <h3 className="text-xl font-semibold text-white mb-2 truncate">
                  {domain.name}
                </h3>

                {/* Expiry Countdown */}
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">
                    {timeLeft[domain.name] || 'Loading...'}
                  </span>
                </div>

                {/* Registrar */}
                <div className="flex items-center gap-2 mb-4">
                  <Building className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">
                    {domain.registrar.name}
                  </span>
                </div>

                {/* Chain Network */}
                {domain.tokens.length > 0 && domain.tokens[0].chain && (
                  <div className="flex items-center gap-2 mb-4">
                    <Network className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-gray-300">
                      {domain.tokens[0].chain.name}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link href={`/test/${domain.name}`} className="block">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>Tokenized: {new Date(domain.tokenizedAt).toLocaleDateString()}</p>
                    <p>Expires: {new Date(domain.expiresAt).toLocaleDateString()}</p>
                    {domain.tokens.length > 0 && (
                      <p>Token ID: {shortenText(domain.tokens[0].tokenId)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
