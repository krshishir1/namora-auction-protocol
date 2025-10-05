import { create } from 'zustand';

import { getOffersFromAuction } from '@/lib/domaApi';

export interface Domain {
  name: string;
  expiresAt: string;
  tokenizedAt: string;
  registrar: {
    name: string;
    websiteUrl?: string;
    ianaId: string;
    publicKeys?: string[];
    claimUrl?: string | null;
  };
  nameservers: string[];
  dsKeys: string[];
  transferLock: boolean;
  claimedBy: string;
  tokens: Array<{
    tokenId: string;
    tokenAddress: string;
    networkId?: string;
    ownerAddress?: string;
    type?: string;
    startsAt: string | null;
    expiresAt: string;
    listings?: any[];
    chain?: {
      name: string;
      networkId: string;
    };
  }>;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidder: string;
  amount: string;
  timestamp: number;
  isHighest: boolean;
}

export interface Auction {
  id: string;
  domain: Domain;
  startTime: number;
  endTime: number;
  reservePrice: string;
  highestBid: string;
  highestBidder: string;
  status: 'active' | 'ended' | 'cancelled';
  bids: Bid[];
  owner: string;
}

interface DomainStore {
  // State
  domains: Domain[];
  auctions: Auction[];
  selectedDomain: Domain | null;
  selectedAuction: Auction | null;
  loading: boolean;
  error: string | null;

  // Minimal mutators
  setData: (data: Partial<Pick<DomainStore, 'domains' | 'auctions' | 'selectedDomain' | 'selectedAuction' | 'loading' | 'error'>>) => void;
  upsertDomain: (domain: Domain) => void;
  removeDomain: (domainName: string) => void;
  upsertAuction: (auction: Auction) => void;
  removeAuction: (auctionId: string) => void;
  recordBid: (auctionId: string, bid: Bid) => void;

  // Query helpers (pure)
  getAuctionById: (auctionId: string) => Auction | undefined;
  getAuctionsByDomain: (domainName: string) => Auction[];

  // Utility
  clearError: () => void;
  reset: () => void;
}

function extractAddress(input: string) {
  const parts = input.split(":");
  const addr = parts[parts.length - 1] || "";
  if (/^0x[a-fA-F0-9]{40}$/.test(addr)) return addr;
  throw new Error("No valid address found");
}

export async function getLatestBids(account: any, tokenID: string, auctionId: string) {
  const offers = await getOffersFromAuction([account?.address], tokenID);

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

  return tBids;
}

export const useDomainStore = create<DomainStore>()((set, get) => ({
      // Initial state
      domains: [],
      auctions: [],
      selectedDomain: null,
      selectedAuction: null,
      loading: false,
      error: null,

      // Minimal setter
      setData: (data) => set(data as any),

      // Domain helpers
      upsertDomain: (domain) => set((state) => {
        const exists = state.domains.some(d => d.name === domain.name)
        return {
          domains: exists ? state.domains.map(d => (d.name === domain.name ? domain : d)) : [...state.domains, domain]
        }
      }),

      removeDomain: (domainName) => set((state) => ({
        domains: state.domains.filter(domain => domain.name !== domainName)
      })),

      // Auction helpers
      upsertAuction: (auction) => set((state) => {
        const exists = state.auctions.some(a => a.id === auction.id)
        return {
          auctions: exists ? state.auctions.map(a => (a.id === auction.id ? auction : a)) : [...state.auctions, auction]
        }
      }),

      removeAuction: (auctionId) => set((state) => ({
        auctions: state.auctions.filter(auction => auction.id !== auctionId)
      })),

      recordBid: (auctionId, bid) => set((state) => ({
        auctions: state.auctions.map(auction =>
          auction.id === auctionId
            ? {
                ...auction,
                highestBid: bid.amount,
                highestBidder: bid.bidder,
                bids: [...auction.bids, bid]
              }
            : auction
        )
      })),

      getAuctionById: (auctionId) => {
        const state = get();
        return state.auctions.find(auction => auction.id === auctionId);
      },

      getAuctionsByDomain: (domainName) => {
        const state = get();
        return state.auctions.filter(auction => auction.domain.name === domainName);
      },

      // Utility actions
      clearError: () => set({ error: null }),
      reset: () => set({
        domains: [],
        auctions: [],
        selectedDomain: null,
        selectedAuction: null,
        loading: false,
        error: null
      })
    })
);
