'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react';
import { useAccount } from 'wagmi'
import { useAccountStore } from '@/store/accountStore';
import { useWalletClient } from 'wagmi';
import { OrderbookType, viemToEthersSigner, createDomaOrderbookClient } from '@doma-protocol/orderbook-sdk';
import { doma_config } from '@/lib/doma';
import { createPublicClient, http, type PublicClient, type WalletClient } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

export default function WalletButton() {

    const { address, isConnected, chain: chn } = useAccount();
    const { data: walletClient } = useWalletClient();

    const {account, chain} = useAccountStore();

    useEffect(() => {
        if(address && isConnected) {
            useAccountStore.setState({
                account: {address},
                chain: {
                    name: chn?.name as string,
                    id: chn?.id as number
                }
            })
        }
    }, [address, isConnected])


    useEffect(() => {

        if(account && chain?.id && walletClient) {
            const signer = viemToEthersSigner(walletClient, `eip155:${chain.id}`);
            createDomaOrderbookClient(doma_config as any)
            useAccountStore.setState({signer})

            // Create viem public client for current chain
            const chainConfig = chain.id === sepolia.id ? sepolia : mainnet
            const publicClient = createPublicClient({
                chain: chainConfig,
                transport: http()
            })

            // Save clients to store
            useAccountStore.getState().setClients({
                publicClient,
                walletClient
            })
        }
        
    }, [walletClient])

    return (
        <div>
            <ConnectButton />
        </div>
    )
}
