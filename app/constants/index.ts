import { Abi } from "viem";
import artifact from "./Orderbook.json";

export const CONTRACT_ADDRESS = "0xeb7c2002f3bb0b756850d990bbac94c7636cc441";
export const CONTRACT_ABI = artifact.abi;

export const TOKEN = "0xdb4e8aea2be902edc2bc615b829e199d7ae2b2db";

export const CONTRACT = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: CONTRACT_ABI as Abi,
};

export const EMAIL_SUBJECT = "Your Interest Rate Bounds Have Been Triggered!";

export const EMAIL_CONTENT = `
Our lending interest rates are now within the range you've been waiting for. Don't miss out on these rates. If you have any questions or need more information, just reach out. We're here to help you make smart financial moves.
`;

export const EXPLORER_URL = "https://zkevm.polygonscan.com/address/";
