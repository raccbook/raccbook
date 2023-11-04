import { Abi } from 'viem'
import artifact from '../../artifacts/contracts/Orderbook.sol/Orderbook.json'

export const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const CONTRACT_ABI = artifact.abi

export const TOKEN = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export const CONTRACT = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: CONTRACT_ABI as Abi,
}
