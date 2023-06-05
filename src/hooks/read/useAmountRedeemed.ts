import { BigNumber } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useAmountRedeemed(dataSource: string | undefined) {
  const { chainData } = useChainData();

  const res = useContractRead({
    addressOrName: dataSource ?? "",
    contractInterface: chainData.DefifaDelegate.interface,
    functionName: "amountRedeemed",
    chainId: chainData.chainId,
    enabled: !!dataSource,
  });

  return {
    ...res,
    data: res.data as unknown as BigNumber,
  };
}
