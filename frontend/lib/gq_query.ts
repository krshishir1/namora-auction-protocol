export const GET_DOMAIN_QUERY = `
query Names(
  $claimStatus: NamesQueryClaimStatus
  $ownedBy: [AddressCAIP10!]
  $name: String
  $tlds: [String!]
  $networkIds: [String!]
  $statuses: [NameOrderbookStatusFilter!]
  $registrarIanaIds: [Int!]
  $fractionalized: Boolean
  $listed: Boolean
  $active: Boolean
  $priceRangeCurrency: String
  $priceRangeMin: Float
  $priceRangeMax: Float
  $take: Int
  $skip: Int
  $sortBy: NamesQuerySortBy
  $sortOrder: SortOrderType
) {
  names(
    claimStatus: $claimStatus
    ownedBy: $ownedBy
    name: $name
    tlds: $tlds
    networkIds: $networkIds
    statuses: $statuses
    registrarIanaIds: $registrarIanaIds
    fractionalized: $fractionalized
    listed: $listed
    active: $active
    priceRangeCurrency: $priceRangeCurrency
    priceRangeMin: $priceRangeMin
    priceRangeMax: $priceRangeMax
    take: $take
    skip: $skip
    sortBy: $sortBy
    sortOrder: $sortOrder
  ) {
    totalCount
    pageSize
    currentPage
    totalPages
    hasPreviousPage
    hasNextPage
    items {
      isFractionalized
      highestOffer {
        price
        currency {
          symbol
          decimals
          usdExchangeRate
        }
      }
      fractionalTokenInfo {
        address
        buyoutPrice
        fractionalizedAt
        status
        params {
          name
          symbol
          initialValuation
          launchStartDate
        }
      }
      name
      expiresAt
      tokenizedAt
      eoi
      registrar {
        name
        websiteUrl
        ianaId
        publicKeys
        claimUrl
      }
      nameservers {
        ldhName
      }
      dsKeys {
        keyTag
        algorithm
        digest
        digestType
      }
      transferLock
      claimedBy
      tokens {
        tokenId
        tokenAddress
        networkId
        ownerAddress
        type
        startsAt
        expiresAt
        listings {
          expiresAt
          offererAddress
          price
          currency {
            decimals
            name
            symbol
          }
        }
        chain {
          name
          networkId
        }
      }
    }
  }
}

`;

export const GET_AUCTION_OFFERS = `
query Offers($tokenId: String!, $skip: Int, $take: Int, $status: OfferStatus, $sortOrder: SortOrderType) {
  offers(
    tokenId: $tokenId
    skip: $skip
    take: $take
    status: $status
    sortOrder: $sortOrder
  ) {
    totalCount
    items {
      externalId
      price
      tokenAddress
      offererAddress
      orderbook
      expiresAt
      createdAt
      currency {
        name
        symbol
        decimals
      }
      name
      id
      nameExpiresAt
      chain {
        name
        networkId
      }
      tokenId
    }
    pageSize
    totalPages
    hasPreviousPage
    hasNextPage
    currentPage
  }
}
`


export const GET_DOMAIN_DETAILS = `
    query Name($name: String!) {
  name(name: $name) {
    name
    expiresAt
    tokenizedAt
    eoi
    isFractionalized
    fractionalTokenInfo {
      address
      poolAddress
      fractionalizedAt
      boughtOutAt
      buyoutPrice
      status
      params {
        name
        symbol
        initialValuation
        launchStartDate
      }
    }
    registrar {
      name
      ianaId
      publicKeys
      websiteUrl
      claimUrl
    }
    nameservers {
      ldhName
    }
    dsKeys {
      keyTag
      algorithm
      digest
      digestType
    }
    transferLock
    claimedBy
    tokens {
      tokenId
      networkId
      ownerAddress
      type
      startsAt
      expiresAt
      explorerUrl
      createdAt
      tokenAddress
      listings {
        id
        externalId
        price
        offererAddress
        orderbook
        expiresAt
        createdAt
        updatedAt
        currency {
          decimals
          name
          symbol
        }
      }
      chain {
        name
        networkId
        addressUrlTemplate
      }
      orderbookDisabled
      activities {
        ... on TokenBoughtOutActivity {
          type
          createdAt
        }
        ... on TokenFractionalizedActivity {
          type
          createdAt
        }
        ... on TokenListedActivity {
          type
          createdAt
        }
        ... on TokenListingCancelledActivity {
          type
          createdAt
        }
        ... on TokenMintedActivity {
          type
          createdAt
        }
        ... on TokenOfferCancelledActivity {
          type
          createdAt
        }
        ... on TokenOfferReceivedActivity {
          type
          buyer
          seller
          createdAt
        }
        ... on TokenPurchasedActivity {
          type
          buyer
          seller
          createdAt
        }
        ... on TokenTransferredActivity {
          type
          transferredTo
          transferredFrom
          createdAt
        }
      }
    }
    activities {
      ... on NameClaimedActivity {
        type
        txHash
        sld
        tld
        createdAt
        claimedBy
      }
      ... on NameRenewedActivity {
        type
        txHash
        sld
        tld
        createdAt
        expiresAt
      }
      ... on NameDetokenizedActivity {
        type
        txHash
        sld
        tld
        createdAt
        networkId
      }
      ... on NameTokenizedActivity {
        type
        txHash
        sld
        tld
        createdAt
        networkId
      }
      ... on NameClaimApprovedActivity {
        type
        createdAt
      }
      ... on NameClaimRejectedActivity {
        type
        createdAt
      }
      ... on NameClaimRequestedActivity {
        type
        createdAt
      }
    }
  }
}
`