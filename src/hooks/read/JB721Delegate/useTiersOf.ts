import { constants } from "ethers";
import { useChainData } from "hooks/useChainData";
import { JB721Tier } from "types/juicebox";
import { useContractRead } from "wagmi";

export function useTiersOf(dataSourceAddress: string | undefined) {
  const { chainData } = useChainData();

  const JBTiered721DelegateStore = chainData.JBTiered721DelegateStore;

  const hasDataSource = Boolean(
    dataSourceAddress && dataSourceAddress !== constants.AddressZero
  );

  const res = useContractRead({
    addressOrName: JBTiered721DelegateStore?.address ?? "",
    contractInterface: JBTiered721DelegateStore?.interface ?? "",
    functionName: "tiersOf",
    enabled: hasDataSource,
    args: hasDataSource ? [dataSourceAddress, [], true, 0, 32] : null,
    chainId: chainData.chainId,
  });

  return {
    ...res,
    data: res.data as unknown as JB721Tier[] | undefined,
  };
}
