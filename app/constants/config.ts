import { defaultWagmiConfig } from '@web3modal/wagmi/react'
import { chains } from './chains'

export const projectId = '1781ae0f89ad163eedbfb2ca5aac691d'

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

export const wagmiConfig =
  defaultWagmiConfig({ chains, projectId, metadata })
