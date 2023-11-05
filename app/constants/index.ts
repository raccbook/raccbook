import { Abi } from "viem";
import artifact from "./Orderbook.json";

export const getContract = (chainId: number) => {
  const config = {
    1115: {
      address: "0x2e2E026c8dE98EBDA430b3D903E701D4788710b6" as `0x${string}`,
      abi: CONTRACT_ABI as Abi,
      token: "0x55623Bc84037F5D3a02d6Ab61b88E874444f8692",
    },
    1442: {
      address: "0xeb7c2002f3bb0b756850d990bbac94c7636cc441" as `0x${string}`,
      abi: CONTRACT_ABI as Abi,
      token: "0xdb4e8aea2be902edc2bc615b829e199d7ae2b2db",
    },
  };

  return config[chainId as keyof typeof config] || config[1115];
};

// export const CONTRACT_ADDRESS = "0x2e2E026c8dE98EBDA430b3D903E701D4788710b6";
export const CONTRACT_ABI = artifact.abi;

// export const TOKEN = "0x55623Bc84037F5D3a02d6Ab61b88E874444f8692";

// export const CONTRACT = {
//   address: CONTRACT_ADDRESS as `0x${string}`,
//   abi: CONTRACT_ABI as Abi,
// };

export const EMAIL_SUBJECT = "Your Interest Rate Bounds Have Been Triggered!";

export const EMAIL_CONTENT = `
Our lending interest rates are now within the range you've been waiting for. Don't miss out on these rates. If you have any questions or need more information, just reach out. We're here to help you make smart financial moves.
`;

export const EXPLORER_URL = "https://zkevm.polygonscan.com/address/";
