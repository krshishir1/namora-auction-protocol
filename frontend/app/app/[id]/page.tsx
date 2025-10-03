"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccountStore } from "@/store/accountStore";
import { useDomainStore, type Bid } from "@/store/domainStore";
import Header from "@/components/Header";
import CreateAuctionModal from "@/components/CreateAuctionModal";
import PlaceBidModal from "@/components/PlaceBidModal";
import BidsLeaderboard from "@/components/BidsLeaderboard";
import { Button } from "@/components/ui/button";
import { intervalToDuration } from "date-fns";
import {
  createAuction as writeCreateAuction,
  getLatestAuctionIdByTokenId,
  getAuctionByDomain,
  readAuction,
  mapAuctionTuple,
  placeBidAndCreateOfferOnEvent,
} from "@/lib/interaction";
import { getDomainFromName, getOffersFromAuction } from "@/lib/domaApi";
import { formatEther, parseEther } from "viem";
import {
  ArrowLeft,
  Globe,
  Clock,
  Building,
  Network,
  Calendar,
  DollarSign,
  TrendingUp,
  User,
} from "lucide-react";

function extractAddress(input) {
  const parts = input.split(":");
  const addr = parts[parts.length - 1] || "";
  if (/^0x[a-fA-F0-9]{40}$/.test(addr)) return addr;
  throw new Error("No valid address found");
}

function shortenText(text) {
  const str = text.toString();
  if (str.length <= 10) return str;
  return str.slice(0, 5) + "..." + str.slice(-5);
}

export default function DomainDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { account, walletClient } = useAccountStore();
  const {
    domains,
    auctions,
    selectedDomain,
    getAuctionsByDomain,
    upsertAuction,
    recordBid,
  } = useDomainStore();
  const { chain, signer } = useAccountStore();

  const [domain, setDomain] = useState<any>(null);
  const [domainAuctions, setDomainAuctions] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [createdOnchainAuctionId, setCreatedOnchainAuctionId] = useState<
    bigint | null
  >(null);

  const tokenIdParam = params.id as string; // domain.io

  useEffect(() => {
    (async function () {
      if (tokenIdParam && walletClient) {
        const result = await getDomainFromName(tokenIdParam);
        console.log(result);
        useDomainStore.setState({ selectedDomain: result });
        setDomain(result);
      }
    })();
  }, [tokenIdParam, walletClient]);

  useEffect(() => {
    (async function () {
      if (selectedDomain) {
        const tokenID = selectedDomain.tokens[0].tokenId;
        const result: any = await getAuctionByDomain(BigInt(tokenID));
        const offers = await getOffersFromAuction([account?.address], tokenID);

        const { auctionId, auction: mapA } = result;

        // Find the highest offer price
        const highestOffer = offers.reduce(
          (max, offer) => (offer.price > max.price ? offer : max),
          offers[0] || { price: 0 }
        );
        const tBids = offers.map((offer: any, index: number) => ({
          id: offer.id || offer.externalId,
          auctionId: auctionId,
          bidder: extractAddress(offer.offererAddress),
          amount: (
            offer.price / Math.pow(10, offer.currency.decimals)
          ).toString(),
          timestamp: new Date(offer.createdAt).getTime(),
          isHighest: offer.price === highestOffer.price,
        }));

        if (mapA) {
          const startMs = Number(mapA.startTime) * 1000;
          const endMs = Number(mapA.endTime) * 1000;
          const settled = Boolean(mapA.settled);
          const now = Date.now();
          const status = settled || endMs <= now ? "ended" : "active";

          const newAuction = {
            id: auctionId.toString(),
            domain,
            startTime: startMs,
            endTime: endMs,
            reservePrice: BigInt(mapA.reservePrice).toString(),
            highestBid: BigInt(mapA.highestBid).toString(),
            highestBidder: mapA.highestBidder,
            status,
            bids: [...tBids],
            owner: mapA.seller as string,
          };

          console.log("New Auction object: ", newAuction);

          upsertAuction(newAuction);
          setDomainAuctions(getAuctionsByDomain(selectedDomain.name));
        }
      }
    })();
  }, [selectedDomain]);

  // Countdown timer effect
  useEffect(() => {
    if (!domain) return;

    const updateCountdown = () => {
      const expiry = new Date(domain.expiresAt).getTime();
      const now = Date.now();
      const diff = expiry - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft("Expired");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [domain]);

  const generateDomainLogo = (domainName: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-pink-500",
    ];
    const colorIndex = domainName.length % colors.length;
    return colors[colorIndex];
  };

  const formatTimeLeft = (ms: number) => {
    if (ms <= 0) return "Ended";

    const duration = intervalToDuration({
      start: 0,
      end: ms, // milliseconds remaining
    });
    const { hours, minutes } = duration;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const isOwner =
    account?.address &&
    domain?.claimedBy === `eip155:${chain?.id}:${account?.address}`;

  const handleCreateAuction = async (auctionData: {
    reservePrice: string;
    duration: number;
  }) => {
    if (!domain) return;

    console.log("Auction details received: ", auctionData);

    try {
      const tokenIdStr = domain.tokens[0]?.tokenId;
      if (!tokenIdStr) throw new Error("Missing tokenId for domain");

      await writeCreateAuction({
        tokenId: BigInt(tokenIdStr),
        durationSeconds: BigInt(auctionData.duration * 60 * 60),
        reservePriceWei: parseEther(auctionData.reservePrice || "0"),
        minIncrementWei: parseEther("0.001"),
      });

      // Fetch latest auction id for this token and read on-chain details
      const [found, onchainAuctionId] = await getLatestAuctionIdByTokenId(
        BigInt(tokenIdStr)
      );
      console.log("auction details", found, onchainAuctionId);
      if (found) {
        setCreatedOnchainAuctionId(onchainAuctionId);
        const a: any = await readAuction(onchainAuctionId);
        const mapA = mapAuctionTuple(a);

        console.log(mapA);

        const startMs = Number(mapA.startTime) * 1000;
        const endMs = Number(mapA.endTime) * 1000;
        const settled = Boolean(mapA.settled);
        const now = Date.now();
        const status = settled || endMs <= now ? "ended" : "active";

        const newAuction = {
          id: onchainAuctionId.toString(),
          domain,
          startTime: startMs,
          endTime: endMs,
          reservePrice: BigInt(mapA.reservePrice).toString(),
          highestBid: BigInt(mapA.highestBid).toString(),
          highestBidder: mapA.highestBidder,
          status,
          bids: [],
          owner: mapA.seller as string,
        };

        console.log("New Auction object: ", newAuction);

        upsertAuction(newAuction);
        setDomainAuctions(getAuctionsByDomain(domain.name));
      }
    } catch (err) {
      console.error("createAuction failed", err);
    }
  };

  const handlePlaceBid = async (auctionId: string, bidAmountEth: string) => {
    if (!account?.address) return;
    try {
      // Bid on-chain and create DOMA offer after BidPlaced event
      const is_success = await placeBidAndCreateOfferOnEvent({
        auctionId: BigInt(auctionId),
        bidAmountWei: parseEther(bidAmountEth || "0"),
        valueEth: "0.001",
      });

      console.log("Bid status", is_success);

      if (is_success) {
        // refresh on-chain auction state and update store
        const a: any = await readAuction(BigInt(auctionId));
        const mapA = mapAuctionTuple(a);
        const startMs = Number(mapA.startTime) * 1000;
        const endMs = Number(mapA.endTime) * 1000;
        const settled = Boolean(mapA.settled);
        const now = Date.now();
        const status = settled || endMs <= now ? "ended" : "active";

        // update existing auction in store
        recordBid(auctionId, {
          id: `bid-${Date.now()}`,
          auctionId,
          bidder: mapA.highestBidder as string,
          amount: BigInt(mapA.highestBid).toString(),
          timestamp: Date.now(),
          isHighest: true,
        });

        const prevAuction = useDomainStore
          .getState()
          .auctions.find((el) => el.id === auctionId);

        console.log("prev auction: ", prevAuction);
        // also update top-level fields
        const newAuction = {
          ...prevAuction,
          startTime: startMs,
          endTime: endMs,
          highestBid: formatEther(BigInt(mapA.highestBid)),
          highestBidder: mapA.highestBidder as string,
          status,
        };

        console.log("new auction: ", newAuction);
        upsertAuction(newAuction);
        setDomainAuctions(getAuctionsByDomain(domain.name));
      }
    } catch (err) {
      console.error("placeBid failed", err);
    }
  };

  if (!domain) {
    return (
      <>
        <Header />
        <div className="container pt-48 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Domain Not Found
          </h1>
          <Button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </>
    );
  }

  const activeAuction = domainAuctions.find(
    (auction) => auction.status === "active"
  );

  return (
    <>
      <Header />

      <div className="container pt-48 text-gray-100">
        {createdOnchainAuctionId && (
          <div className="mb-4 bg-green-900/20 border border-green-500/30 text-green-300 px-4 py-3 rounded">
            Auction created on-chain. ID: {createdOnchainAuctionId.toString()}
          </div>
        )}
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-6 border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Domains
        </Button>

        {/* Domain Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 mb-8">
          <div className="flex items-start gap-6">
            {/* Domain Logo */}
            <div
              className={`w-24 h-24 ${generateDomainLogo(
                domain.name
              )} rounded-lg flex items-center justify-center text-white font-bold text-3xl`}
            >
              {domain.name.charAt(0).toUpperCase()}
            </div>

            {/* Domain Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-4">
                {domain.name}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Expiry Countdown */}
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-300">
                    <span className="text-white font-medium">Expires:</span>{" "}
                    {timeLeft}
                  </span>
                </div>

                {/* Registrar */}
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">
                    <span className="text-white font-medium">Registrar:</span>{" "}
                    {domain.registrar.name}
                  </span>
                </div>

                {/* Chain Network */}
                {domain.tokens.length > 0 && domain.tokens[0].chain && (
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-300">
                      <span className="text-white font-medium">Network:</span>{" "}
                      {domain.tokens[0].chain.name}
                    </span>
                  </div>
                )}

                {/* Token ID */}
                {domain.tokens.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">
                      <span className="text-white font-medium">Token ID:</span>{" "}
                      {shortenText(domain.tokens[0].tokenId)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-green-400" />
              Owner Actions
            </h2>

            {!activeAuction ? (
              <CreateAuctionModal
                domain={domain}
                onAuctionCreate={handleCreateAuction}
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Auction
                </Button>
              </CreateAuctionModal>
            ) : (
              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                <p className="text-blue-400">
                  You already have an active auction for this domain.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Active Auction */}
        {activeAuction && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Active Auction
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Current Bid</span>
                </div>
                <p className="text-white text-2xl font-bold">
                  {formatEther(BigInt(activeAuction.highestBid))} ETH
                </p>
              </div>

              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-gray-300 text-sm">Time Left</span>
                </div>
                <p className="text-white text-2xl font-bold">
                  {activeAuction.endTime > Date.now()
                    ? formatTimeLeft(activeAuction.endTime - Date.now())
                    : "Ended"}
                </p>
              </div>

              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">Reserve Price</span>
                </div>
                <p className="text-white text-2xl font-bold">
                  {formatEther(BigInt(activeAuction.reservePrice))} ETH
                </p>
              </div>
            </div>

            {/* Bidder Actions */}
            {!isOwner && (
              <div className="mt-6">
                <PlaceBidModal
                  auction={activeAuction}
                  onBidPlace={(bidAmount) =>
                    handlePlaceBid(activeAuction.id, bidAmount)
                  }
                >
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Place Bid
                  </Button>
                </PlaceBidModal>
              </div>
            )}
          </div>
        )}

        {/* Bids Leaderboard */}
        {activeAuction && <BidsLeaderboard auction={activeAuction} />}

        {/* Domain Details */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Domain Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                Registration Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tokenized:</span>
                  <span className="text-white">
                    {new Date(domain.tokenizedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Expires:</span>
                  <span className="text-white">
                    {new Date(domain.expiresAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transfer Lock:</span>
                  <span className="text-white">
                    {domain.transferLock ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                Technical Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Nameservers:</span>
                  <span className="text-white">
                    {domain.nameservers.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">DS Keys:</span>
                  <span className="text-white">{domain.dsKeys.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Claimed By:</span>
                  <span className="text-white font-mono text-xs">
                    {domain.claimedBy.slice(0, 6)}...
                    {domain.claimedBy.slice(-4)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
