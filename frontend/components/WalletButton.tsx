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
            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                }) => {
                    // Note: If your app doesn't use authentication, you
                    // can remove all 'authenticationStatus' checks
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus ||
                            authenticationStatus === 'authenticated');

                    return (
                        <div
                            {...(!ready && {
                                'aria-hidden': true,
                                'style': {
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                },
                            })}
                        >
                            {(() => {
                                if (!connected) {
                                    return (
                                        <button
                                            onClick={openConnectModal}
                                            type="button"
                                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
                                        >
                                            Connect Wallet
                                        </button>
                                    );
                                }

                                if (chain.unsupported) {
                                    return (
                                        <button
                                            onClick={openChainModal}
                                            type="button"
                                            className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
                                        >
                                            Wrong network
                                        </button>
                                    );
                                }

                                return (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={openChainModal}
                                            type="button"
                                            className="bg-primary text-primary-foreground px-3 py-2 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                                        >
                                            {chain.hasIcon && (
                                                <div
                                                    style={{
                                                        background: chain.iconBackground,
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: 999,
                                                        overflow: 'hidden',
                                                        marginRight: 4,
                                                    }}
                                                >
                                                    {chain.iconUrl && (
                                                        <img
                                                            alt={chain.name ?? 'Chain icon'}
                                                            src={chain.iconUrl}
                                                            style={{ width: 12, height: 12 }}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                            {chain.name}
                                        </button>

                                        <button
                                            onClick={openAccountModal}
                                            type="button"
                                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
                                        >
                                            {account.displayName}
                                            {account.displayBalance
                                                ? ` (${account.displayBalance})`
                                                : ''}
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    );
                }}
            </ConnectButton.Custom>
        </div>
    )
}
