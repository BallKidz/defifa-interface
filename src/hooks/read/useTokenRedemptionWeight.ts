import { BigNumber, constants } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useTokenRedemptionWeight(
  dataSource: string | undefined,
  tokenId: string
) {
  const { chainData } = useChainData();

  const res = useContractRead({
    addressOrName: dataSource ?? "",
    contractInterface: chainData.DefifaDelegate.interface,
    functionName: "redemptionWeightOf(uint256)",
    args: [tokenId],
    chainId: chainData.chainId,
    enabled: Boolean(dataSource && dataSource !== constants.AddressZero),
  });

  return {
    ...res,
    data: res.data as unknown as BigNumber | undefined,
  };
}
