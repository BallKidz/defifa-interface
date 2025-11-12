import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";
import DefifaDelegate from "../../abis/DefifaDelegate.json";

export function useDefaultAttestationDelegate(dataSourceAddress: string | undefined) {
  const { chainData } = useChainData();

  const res = useReadContract({
    address: dataSourceAddress as `0x${string}`,
    abi: (DefifaDelegate as any).abi as Abi,
    functionName: "defaultAttestationDelegate",
    chainId: chainData.chainId,
    query: {
      enabled: Boolean(dataSourceAddress),
    },
  });

  return {
    ...res,
    data: res.data as unknown as string | undefined,
  };
}


