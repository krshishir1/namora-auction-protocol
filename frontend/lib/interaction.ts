import { useAccountStore } from '@/store/accountStore'
import { auction_address, tokenContractAddress, tokenCurrencyAddress, doma_config } from '@/lib/doma'
import { parseEther, type Address, decodeEventLog } from 'viem'
import { createDomaOrderbookClient, OrderbookType } from '@doma-protocol/orderbook-sdk'

// Import Hardhat artifact (ABI)
// Ensure this path matches your generated artifacts structure
// Typical Hardhat output: artifacts/contracts/<File>.sol/<Contract>.json
// If the contract name or folders differ, update the import path accordingly.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - json import for ABI
import AuctionArtifact from '@/artifacts/contracts/EnglishAuction.sol/DomaDomainAuction.json'

type Abi = typeof AuctionArtifact.abi

function getAuctionAddress(): Address {
  const { chain } = useAccountStore.getState()
  // Default to sepolia if unknown
  const chainId = chain?.id
  if (chainId === 11155111) {
    return auction_address.sepolia as Address
  }
  return auction_address.sepolia as Address
}

function getClients() {
  const { publicClient, walletClient, account } = ((): any => {
    const state = useAccountStore.getState() as any
    return { publicClient: state.publicClient, walletClient: state.walletClient, account: state.account }
  })()
  if (!publicClient) throw new Error('publicClient not initialized')
  if (!walletClient) throw new Error('walletClient not initialized')
  return { publicClient, walletClient, account }
}

export async function readAuction(auctionId: bigint) {
  const { publicClient } = getClients()
  const address = getAuctionAddress()
  return publicClient.readContract({
    address,
    abi: AuctionArtifact.abi as Abi,
    functionName: 'auctions',
    args: [auctionId],
  })
}

// Map solidity tuple to friendly object reflecting new contract shape
export function mapAuctionTuple(a: any) {
  return {
    tokenId: a[0] as bigint,
    seller: a[1] as Address,
    startTime: Number(a[2]) * 1000,
    endTime: Number(a[3]) * 1000,
    reservePrice: a[4] as bigint,
    minIncrement: a[5] as bigint,
    settled: Boolean(a[6]),
    highestBidder: a[7] as Address,
    highestBid: a[8] as bigint,
    domainName: a[9] as string,
  }
}

export async function getLatestAuctionIdByTokenId(tokenId: bigint) {
  const { publicClient } = getClients()
  const address = getAuctionAddress()
  // returns (bool found, uint256 auctionId)
  return publicClient.readContract({
    address,
    abi: AuctionArtifact.abi as Abi,
    functionName: 'getLatestAuctionIdByTokenId',
    args: [tokenId],
  }) as Promise<readonly [boolean, bigint]>
}


export async function getLatestAuctionIdByDomainName(domainName: string) {
  const { publicClient } = getClients()
  const address = getAuctionAddress()
  return publicClient.readContract({
    address,
    abi: AuctionArtifact.abi as Abi,
    functionName: 'getLatestAuctionIdByDomainName',
    args: [domainName],
  }) as Promise<readonly [boolean, bigint]>
}

export async function getAuctionByDomain(tokenId: bigint) {
  const [found, auctionId] = await getLatestAuctionIdByTokenId(tokenId)
  if (!found) return null
  const tuple = await readAuction(auctionId)
  const auction = mapAuctionTuple(tuple)
  return { auctionId, auction }
}

export async function getUserBidAmount(auctionId: bigint, user: Address) {
  const { publicClient } = getClients()
  const address = getAuctionAddress()
  return publicClient.readContract({
    address,
    abi: AuctionArtifact.abi as Abi,
    functionName: 'getUserBidAmount',
    args: [auctionId, user],
  })
}

export async function createAuction(
  params: {
    tokenId: bigint
    domainName: string
    durationSeconds: bigint
    reservePriceWei: bigint
    minIncrementWei: bigint
  }
) {
  const { walletClient, publicClient, account } = getClients()
  const address = getAuctionAddress()
  const hash = await walletClient.writeContract({
    address,
    abi: AuctionArtifact.abi as Abi,
    functionName: 'createAuction',
    args: [params.tokenId, params.domainName, params.durationSeconds, params.reservePriceWei, params.minIncrementWei],
    account: (account?.address || undefined) as Address | undefined,
  })
  return publicClient.waitForTransactionReceipt({ hash })
}

export async function placeBid(
  params: {
    auctionId: bigint
    bidAmountWei: bigint // this is the logical bid amount checked against minIncrement/reserve in contract
    valueEth?: string // default 0.001 per contract requirement
  }
) {
  const { walletClient, publicClient, account } = getClients()
  const address = getAuctionAddress()
  const value = params.valueEth ? parseEther(params.valueEth) : parseEther('0.001')
  const hash = await walletClient.writeContract({
    address,
    abi: AuctionArtifact.abi as Abi,
    functionName: 'placeBid',
    args: [params.auctionId, params.bidAmountWei],
    value,
    account: (account?.address || undefined) as Address | undefined,
  })
  return publicClient.waitForTransactionReceipt({ hash })
}

// Place bid and, after receiving BidPlaced event in the tx receipt, create a DOMA Orderbook offer
export async function placeBidAndCreateOfferOnEvent(
  params: {
    auctionId: bigint
    bidAmountWei: bigint
    valueEth?: string
  }
) {

    console.log("params received on bid placed: ", params)

  const { walletClient, publicClient, account } = getClients()
  const address = getAuctionAddress()
  const value = params.valueEth ? parseEther(params.valueEth) : parseEther('0.001')

  const hash = await walletClient.writeContract({
    address,
    abi: AuctionArtifact.abi as Abi,
    functionName: 'placeBid',
    args: [params.auctionId, params.bidAmountWei],
    value,
    account: (account?.address || undefined) as Address | undefined,
  })

  const receipt = await publicClient.waitForTransactionReceipt({ hash })

  // Scan logs for BidPlaced event (signature now includes domainName)
  let tokenIdFromEvent: bigint | null = null
  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({ abi: AuctionArtifact.abi as Abi, data: log.data, topics: log.topics }) as any
      if (decoded.eventName === 'BidPlaced') {
        // event BidPlaced(uint256 auctionId, uint256 tokenId, string domainName, address bidder, uint256 amount)
        const args: any = decoded.args
        const evAuctionId: bigint = args.auctionId ?? args[0]
        const evTokenId: bigint = args.tokenId ?? args[1]
        if (evAuctionId === params.auctionId) {
          tokenIdFromEvent = evTokenId
          break
        }
      }
    } catch (_) {
      // ignore non-matching logs
    }
  }

  if (tokenIdFromEvent !== null) {
    const state = useAccountStore.getState() as any
    const signer = state.signer
    const chain = state.chain
    if (signer && chain?.id) {
      const client = await createDomaOrderbookClient(doma_config as any)
      await client.createOffer({
        params: {
          items: [
            {
              contract: tokenContractAddress.sepolia,
              tokenId: String(tokenIdFromEvent),
              currencyContractAddress: tokenCurrencyAddress.sepolia_weth,
              price: params.bidAmountWei.toString(),
            },
          ],
          orderbook: OrderbookType.DOMA,
          expirationTime: Math.floor(Date.now() / 1000) + 86400,
        },
        signer,
        chainId: `eip155:${chain.id}`,
        onProgress: (step: string, progress: number) => {
          console.log(`Creating offer: ${step} (${progress}%)`)
        },
      })
    }
  }

  return tokenIdFromEvent !== null
}

export async function withdrawOverbidFunds() {
  const { walletClient, publicClient, account } = getClients()
  const address = getAuctionAddress()
  const hash = await walletClient.writeContract({
    address,
    abi: AuctionArtifact.abi as Abi,
    functionName: 'withdraw',
    args: [],
    account: (account?.address || undefined) as Address | undefined,
  })
  return publicClient.waitForTransactionReceipt({ hash })
}

export async function settleAuction(auctionId: bigint) {
  const { walletClient, publicClient, account } = getClients()
  const address = getAuctionAddress()
  const hash = await walletClient.writeContract({
    address,
    abi: AuctionArtifact.abi as Abi,
    functionName: 'settleAuction',
    args: [auctionId],
    account: (account?.address || undefined) as Address | undefined,
  })
  return publicClient.waitForTransactionReceipt({ hash })
}

// Helper: read pending withdrawals for current user if needed
export async function readPendingWithdrawal(user: Address) {
  const { publicClient } = getClients()
  const address = getAuctionAddress()
  return publicClient.readContract({
    address,
    abi: AuctionArtifact.abi as Abi,
    functionName: 'pendingWithdrawals',
    args: [user],
  })
}


