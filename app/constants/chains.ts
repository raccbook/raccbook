import { enviroment } from '@/types/chains'
import { hardhat, mainnet, polygonZkEvmTestnet, sepolia } from 'wagmi/chains'

const chainConfig = {
  localhost: [hardhat],
  testnet: [polygonZkEvmTestnet],
  mainnet: [polygonZkEvmTestnet],
}

export const chains =
  chainConfig[
    (process.env.NEXT_PUBLIC_CHAIN_ENVIROMENT as enviroment) || 'localhost'
  ]
