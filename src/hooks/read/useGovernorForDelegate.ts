import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useGovernorForDelegate(dataSource: string) {
  const { chainData } = useChainData();

  const res = useContractRead({
    addressOrName: dataSource,
    contractInterface: chainData.DefifaDelegate.interface,
    functionName: "owner",
    chainId: chainData.chainId,
  });

  return {
    ...res,
    data: res.data as unknown as string,
  };
}
