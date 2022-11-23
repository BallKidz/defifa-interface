import { useContractRead } from "wagmi";
import { useChainData } from "../useChainData";

export function useNumberOutstandingResponse(tier: number) {
  const { chainData } = useChainData();
  const { data } = useContractRead({
    addressOrName: chainData.JBTiered721DelegateStore.address,
    contractInterface: chainData.JBTiered721DelegateStore.interface,
    functionName: "numberOfReservedTokensOutstandingFor",
    args: [chainData.defifaDelegate, tier],
    chainId: chainData.chainId,
    onSuccess: (data) => {},
    onError: (error) => {},
  });
  return data;
}
