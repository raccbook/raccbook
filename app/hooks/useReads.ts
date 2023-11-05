import { getContract } from "@/constants";
import { useContractReads, useNetwork } from "wagmi";

interface ContractFunction {
  functionName: string;
  args?: any[];
}

export const useReads = (functions: ContractFunction[]) => {
  const { chain } = useNetwork();
  const chainId = chain?.id;

  const contracts = functions.map(({ functionName, args }) => ({
    address: getContract(chainId!).address,
    abi: getContract(chainId!).abi,
    functionName,
    args,
  }));

  const { data, isError, isLoading } = useContractReads({
    contracts,
    watch: true,
  });

  return { data, isError, isLoading };
};
