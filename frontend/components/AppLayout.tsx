"use client";

import '@rainbow-me/rainbowkit/styles.css'

import { WagmiProvider } from "wagmi";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>

            <RainbowKitProvider>
                {children}
            </RainbowKitProvider>

        </QueryClientProvider>
    </WagmiProvider>
  );
}
