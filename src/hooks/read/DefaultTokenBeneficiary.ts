import { constants } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useDefaultTokenBeneficiary(dataSourceAddress: string | undefined) {
  const { chainData } = useChainData();

  const JBTiered721DelegateStore = chainData.JBTiered721DelegateStore;

  const hasDataSource = Boolean(
    dataSourceAddress && dataSourceAddress !== constants.AddressZero
  );

  return useContractRead({
    addressOrName: JBTiered721DelegateStore?.address ?? "",
    contractInterface: JBTiered721DelegateStore?.interface ?? "",
    functionName: "defaultReservedTokenBeneficiaryOf",
    enabled: hasDataSource,
    args: hasDataSource ? [dataSourceAddress] : null,
    chainId: chainData.chainId,
  });
}