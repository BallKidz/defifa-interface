import { constants } from "ethers";
import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function useNftRewardTiersOf(dataSourceAddress: string | undefined) {
  const network = useNetwork();

  const chainData = getChainData(network?.chain?.id);

  const JBTiered721DelegateStore = chainData.JBTiered721DelegateStore;

  const hasDataSource =
    dataSourceAddress && dataSourceAddress !== constants.AddressZero;

  return useContractRead({
    addressOrName: JBTiered721DelegateStore?.address ?? "",
    contractInterface: JBTiered721DelegateStore?.interface ?? "",
    functionName: "tiers",
    enabled: !!hasDataSource,
    args: hasDataSource ? [dataSourceAddress, 0, 32] : null,
    chainId: chainData.chainId,
  });
}
