import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "./scripts/populate";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          evmVersion: "paris",
        },
      },
    ],
  },
  networks: {
    zkevm: {
      url: `https://rpc.public.zkevm-test.net`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY ?? ""],
    },
    coredao: {
      url: "https://rpc.test.btcs.network",
      accounts: [process.env.ACCOUNT_PRIVATE_KEY ?? ""],
      chainId: 1115,
    },
  },
  etherscan: {
    apiKey: {
      zkevm: process.env.ETHERSCAN_API ?? "",
    },
    customChains: [
      {
        network: "zkevm",
        chainId: 1442,
        urls: {
          apiURL: "https://explorer.public.zkevm-test.net/api",
          browserURL: "https://explorer.public.zkevm-test.net/",
        },
      },
    ],
  },
};

export default config;
