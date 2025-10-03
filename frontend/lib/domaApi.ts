
import { GET_DOMAIN_QUERY, GET_AUCTION_OFFERS, GET_DOMAIN_DETAILS } from "./gq_query";

export async function getDomainsFromAccounts(accounts: string[]) {

    const addresses = accounts.map((el) => `eip155:1:${el}`)

    const response = await fetch("https://api-testnet.doma.xyz/graphql", {
        method: "POST",
        headers: {
          "accept": "application/graphql-response+json, application/json",
          "content-type": "application/json",
          "api-key": process.env.NEXT_PUBLIC_DOMA_API_KEY,
        },
        body: JSON.stringify({
          query: GET_DOMAIN_QUERY,
          variables: {
            skip: 0,
            take: 20,
            ownedBy: addresses,
            claimStatus: "ALL"
          },
          operationName: "Names"
        }),
        cache: "no-store", // prevents Next.js caching
      });

    const data = await response.json()

    return data.data.names ? data.data.names.items : []
}

export async function getDomainFromName(name: string) {

    try {
        const response = await fetch("https://api-testnet.doma.xyz/graphql", {
          method: "POST",
          headers: {
            "accept": "application/graphql-response+json, application/json",
            "api-key": process.env.NEXT_PUBLIC_DOMA_API_KEY,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            query: GET_DOMAIN_DETAILS,
            variables: {
              name
            },
            operationName: "Name"
          })
        });
    
        const data = await response.json();
        console.log("Domain extracted: ", data);

        return data.data.name;
      } catch (error) {
        console.error("Error fetching name data:", error);
      }
}

export async function getOffersFromAuction (accounts: string[], tokenId: string) {

    const addresses = accounts.map((el) => `eip155:1:${el}`)

    try {
        const response = await fetch("https://api-testnet.doma.xyz/graphql", {
          method: "POST",
          headers: {
            "accept": "application/graphql-response+json, application/json",
            "api-key": process.env.NEXT_PUBLIC_DOMA_API_KEY,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            query: GET_AUCTION_OFFERS,
            variables: {
              take: 100,
              tokenId
            },
            operationName: "Offers"
          })
        });
    
        const data = await response.json();
        // console.log(data); 

        return data.data.offers.items
      } catch (error) {
        console.error("Error fetching offers:", error);
      }

}
