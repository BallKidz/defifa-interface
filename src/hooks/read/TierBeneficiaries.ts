import { constants } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useTierBeneficiaries(
  dataSourceAddress: string | undefined,
  maxTiers: number
) {
  const { chainData } = useChainData();

  const JBTiered721DelegateStore = chainData.JBTiered721DelegateStore;

  const hasDataSource = Boolean(
    dataSourceAddress && dataSourceAddress !== constants.AddressZero
  );

  return useContractRead({
    addressOrName: JBTiered721DelegateStore?.address ?? "",
    contractInterface: JBTiered721DelegateStore?.interface ?? "",
    functionName: "reservedTokenBeneficiaryOf",
    enabled: hasDataSource,
    args: hasDataSource ? [dataSourceAddress, maxTiers] : null,
    chainId: chainData.chainId,
  });
}
