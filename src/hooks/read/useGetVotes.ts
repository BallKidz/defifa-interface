import { useChainData } from "hooks/useChainData";
import { useAccount, useBlockNumber, useContractRead } from "wagmi";

export function useAccountVotes(governor: string | undefined) {
  const { address } = useAccount();
  const { chainData } = useChainData();
  const { data: block } = useBlockNumber({
    watch: false,
    staleTime: 60 * 60 * 5,
  });

  return useContractRead({
    addressOrName: governor ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "getVotes",
    args: block ? [address, block - 1] : null,
    chainId: chainData.chainId,
    enabled: !!governor,
  });
}
