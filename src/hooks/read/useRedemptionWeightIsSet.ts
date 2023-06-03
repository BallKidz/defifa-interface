import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useRedemptionWeightIsSet(dataSource: string | undefined) {
  const { chainData } = useChainData();

  const res = useContractRead({
    addressOrName: dataSource ?? "",
    contractInterface: chainData.DefifaDelegate.interface,
    functionName: "redemptionWeightIsSet",
    chainId: chainData.chainId,
    enabled: !!dataSource,
  });

  return {
    ...res,
    data: res.data as unknown as boolean,
  };
}
