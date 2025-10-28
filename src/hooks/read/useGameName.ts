import { useReadContract } from "wagmi";
import { useChainData } from "hooks/useChainData";
import { Abi } from "viem";

export function useGameName(dataSource: string) {
  const { chainData } = useChainData();

  const { data: gameName } = useReadContract({
    address: dataSource as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "name",
    chainId: chainData.chainId,
  });

  return gameName;
}
