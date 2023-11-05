import { getContract } from "@/constants";
import { useNetwork, usePrepareContractWrite } from "wagmi";

export const usePrepareWrite = (
  functionName: string,
  args?: (string | number | [])[],
  value?: bigint
) => {
  const { chain } = useNetwork();
  const chainId = chain?.id;
  const { config, error, isError, isLoading, isSuccess } =
    usePrepareContractWrite({
      address: getContract(chainId!).address,
      abi: getContract(chainId!).abi,
      functionName,
      args,
      value,
    });

  return { config, error, isError, isLoading, isSuccess };
};
