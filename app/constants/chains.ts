import { enviroment } from '@/types/chains'
import { hardhat, mainnet, sepolia } from 'wagmi/chains'

const chainConfig = {
  localhost: [hardhat],
  testnet: [sepolia],
  mainnet: [sepolia, mainnet],
}

export const CHAINS =
  chainConfig[
    (process.env.NEXT_PUBLIC_CHAIN_ENVIROMENT as enviroment) || 'localhost'
  ]
