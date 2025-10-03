import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL as string,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY as string]
    }
  },
  paths: {
    artifacts: "./frontend/artifacts"
  }
};

export default config;
