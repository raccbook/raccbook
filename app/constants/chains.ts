import { enviroment } from "@/types/chains";
import { defineChain } from "viem";
import { hardhat, mainnet, polygonZkEvmTestnet, sepolia } from "wagmi/chains";

export const coredao = defineChain({
  id: 1115,
  name: "CoreDao Testnet",
  network: "coredao",
  nativeCurrency: {
    decimals: 18,
    name: "TCore",
    symbol: "TCORE",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.test.btcs.network"],
    },
    public: {
      http: ["https://rpc.test.btcs.network"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://scan.test.btcs.network/" },
  },
});

const chainConfig = {
  localhost: [hardhat],
  testnet: [polygonZkEvmTestnet, coredao],
  mainnet: [polygonZkEvmTestnet, coredao],
};

export const chains =
  chainConfig[
    (process.env.NEXT_PUBLIC_CHAIN_ENVIROMENT as enviroment) || "localhost"
  ];
