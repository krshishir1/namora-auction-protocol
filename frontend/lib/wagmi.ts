import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit'

export const config = getDefaultConfig({
  appName: 'Doma Bid',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT, // get from WalletConnect Cloud
  chains: [sepolia],
  ssr: true, // support Next.js SSR
})

// export const config = createConfig({
//   chains: [sepolia],
//   transports: {
//     [sepolia.id]: http(),
//   },
//   connectors: [
//     injected(),
//     metaMask(),
//     // walletConnect({ projectId: 'YOUR_WALLETCONNECT_PROJECT_ID' }),
//   ],
// })
