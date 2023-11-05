import { getContract } from "@/constants";
import { useContractRead, useNetwork } from "wagmi";

export const useRead = (functionName: string, args?: any[]) => {
  const { chain } = useNetwork();
  const chainId = chain?.id;

  const { data, isError, isLoading } = useContractRead({
    address: getContract(chainId!).address,
    abi: getContract(chainId!).abi,
    functionName,
    args,
    watch: true,
  });

  return { data, isError, isLoading };
};
