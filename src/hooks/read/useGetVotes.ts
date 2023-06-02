import { useChainData } from "hooks/useChainData";
import { useAccount, useBlockNumber, useContractRead } from "wagmi";

export function useAccountVotes(governor: string | undefined) {
  const { address } = useAccount();
  const { chainData } = useChainData();
  const { data: block } = useBlockNumber();

  return useContractRead({
    addressOrName: governor ?? "",
    contractInterface: chainData.DefifaGovernor.interface,
    functionName: "getVotes",
    args: [address, (block ?? 0) - 1],
    chainId: chainData.chainId,
    enabled: !!governor,
  });
}
