import { BigNumber } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useAmountRedeemed(dataSource: string | undefined) {
  const { chainData } = useChainData();

  const res = useReadContract({
    address: dataSource as `0x${string}`,
    abi: chainData.DefifaDelegate.interface as Abi,
    functionName: "amountRedeemed",
    chainId: chainData.chainId,
    query: {
      enabled: !!dataSource,
    },
  });

  return {
    ...res,
    data: res.data as unknown as BigNumber,
  };
}
