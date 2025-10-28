import { constants } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useDefaultTokenBeneficiary(
  dataSourceAddress: string | undefined
) {
  const { chainData } = useChainData();

  const JBTiered721DelegateStore = chainData.JBTiered721DelegateStore;

  const hasDataSource = Boolean(
    dataSourceAddress && dataSourceAddress !== constants.AddressZero
  );

  return useReadContract({
    address: JBTiered721DelegateStore?.address as `0x${string}`,
    abi: JBTiered721DelegateStore?.interface as Abi,
    functionName: "defaultReservedTokenBeneficiaryOf",
    args: hasDataSource ? [dataSourceAddress] : undefined,
    chainId: chainData.chainId,
    query: {
      enabled: hasDataSource,
    },
  });
}
