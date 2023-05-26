import { constants } from "ethers";
import { useContractRead, useNetwork } from "wagmi";
import { useChainData } from "hooks/useChainData";

export function useNftRewardTiersOf(dataSourceAddress: string | undefined) {
  const network = useNetwork();

  const { chainData } = useChainData();

  const JBTiered721DelegateStore = chainData.JBTiered721DelegateStore;

  const hasDataSource =
    dataSourceAddress && dataSourceAddress !== constants.AddressZero;

  return useContractRead({
    addressOrName: JBTiered721DelegateStore?.address ?? "",
    contractInterface: JBTiered721DelegateStore?.interface ?? "",
    functionName: "tiersOf",
    enabled: !!hasDataSource,
    args: hasDataSource ? [dataSourceAddress, [0], true, 0, 32] : null,
    chainId: chainData.chainId,
  });
}
