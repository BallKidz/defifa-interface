import { BigNumber, constants } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useNftRewardsTotalSupply(
  dataSourceAddress: string | undefined
) {
  const { chainData } = useChainData();

  const JBTiered721DelegateStore = chainData.JBTiered721DelegateStore;
  const hasDataSource = Boolean(
    dataSourceAddress && dataSourceAddress !== constants.AddressZero
  );

  const res = useContractRead({
    addressOrName: JBTiered721DelegateStore?.address ?? "",
    contractInterface: JBTiered721DelegateStore?.interface ?? "",
    functionName: "totalSupply",
    args: dataSourceAddress,
    watch: true,
    chainId: chainData.chainId,
    enabled: hasDataSource,
  });

  return {
    ...res,
    data: res.data as unknown as BigNumber,
  };
}
