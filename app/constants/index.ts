import { Abi } from "viem";
import artifact from "./Orderbook.json";

export const CONTRACT_ADDRESS = "0x016659ab1c80a167e7f8fb30c68101c314a43266";
export const CONTRACT_ABI = artifact.abi;

export const TOKEN = "0x2e2e026c8de98ebda430b3d903e701d4788710b6";

export const CONTRACT = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: CONTRACT_ABI as Abi,
};

export const EMAIL_SUBJECT = "Your Interest Rate Bounds Have Been Triggered!";

export const EMAIL_CONTENT = `
Our lending interest rates are now within the range you've been waiting for. Don't miss out on these rates. If you have any questions or need more information, just reach out. We're here to help you make smart financial moves.
`;

export const EXPLORER_URL = "https://zkevm.polygonscan.com/address/";
