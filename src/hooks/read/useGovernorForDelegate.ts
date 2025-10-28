import { constants } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";
import DefifaDelegate from "../../abis/DefifaDelegate.json";

export function useGovernorForDelegate(dataSource: string | undefined) {
  const { chainData } = useChainData();

  const res = useReadContract({
    address: dataSource as `0x${string}`,
    abi: DefifaDelegate.abi,
    functionName: "owner",
    chainId: chainData.chainId,
    query: {
      enabled: Boolean(dataSource && dataSource !== constants.AddressZero),
    },
  });

  // Removed debug logs to prevent rate limiting

  return {
    ...res,
    data: res.data as unknown as string,
  };
}
