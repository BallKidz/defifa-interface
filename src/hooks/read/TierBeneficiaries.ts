import { constants } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useReadContract } from "wagmi";
import { Abi } from "viem";

export function useTierBeneficiaries(
  dataSourceAddress: string | undefined,
  maxTiers: number
) {
  const { chainData } = useChainData();

  const JBTiered721DelegateStore = chainData.JBTiered721DelegateStore;

  const hasDataSource = Boolean(
    dataSourceAddress && dataSourceAddress !== constants.AddressZero
  );

  return useReadContract({
    address: JBTiered721DelegateStore?.address as `0x${string}`,
    abi: JBTiered721DelegateStore?.interface as Abi,
    functionName: "reservedTokenBeneficiaryOf",
    query: {
      enabled: hasDataSource,
    },
    args: hasDataSource ? [dataSourceAddress, maxTiers] : undefined,
    chainId: chainData.chainId,
  });
}
