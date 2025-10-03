import { create } from "zustand";
import type { PublicClient, WalletClient } from "viem";

interface WalletState {
  address: string | null;
}


interface AccountInterface {
    account: WalletState | null;
    chain: {
        name: string,
        id: number
    } | null;
    signer: any;
    publicClient: PublicClient | null;
    walletClient: WalletClient | null;
    setAccount: (_acc: any) => void;
    setClients: (clients: { publicClient?: PublicClient | null; walletClient?: WalletClient | null }) => void;
}

export const useAccountStore = create<AccountInterface>((set) => ({
  account: null,
  chain: null,
  signer: null,
  publicClient: null,
  walletClient: null,
  setAccount: (_account: any) => {
    set({
        account : _account
    })
  },
  setClients: (clients) => {
    set((state) => ({
      publicClient: clients.publicClient ?? state.publicClient,
      walletClient: clients.walletClient ?? state.walletClient,
    }))
  }
}));