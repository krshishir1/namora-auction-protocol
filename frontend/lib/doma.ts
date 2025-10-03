

export const doma_config = {
    apiClientOptions: {
      baseUrl: 'https://api-testnet.doma.xyz',
      defaultHeaders: 
      { 
        'Api-key': process.env.NEXT_PUBLIC_DOMA_API_KEY, 'Content-Type': 'application/json'  },
    },
  }

  export const auction_address = {
    sepolia: "0xf7a5919AbF08A7F5D5088988aa0c3deD9917fe4C"
  }


  export const tokenContractAddress = {
    sepolia: "0x9A374915648f1352827fFbf0A7bB5752b6995eB7"
  }

  export const tokenCurrencyAddress = {
    sepolia_weth: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    sepolia_usdc: "0xf08A50178dfcDe18524640EA6618a1f965821715"
  }