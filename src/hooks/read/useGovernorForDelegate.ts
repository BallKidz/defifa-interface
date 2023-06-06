import { constants } from "ethers";
import { useChainData } from "hooks/useChainData";
import { useContractRead } from "wagmi";

export function useGovernorForDelegate(dataSource: string | undefined) {
  const { chainData } = useChainData();

  const res = useContractRead({
    addressOrName: dataSource ?? "",
    contractInterface: chainData.DefifaDelegate.interface,
    functionName: "owner",
    chainId: chainData.chainId,
    enabled: Boolean(dataSource && dataSource !== constants.AddressZero),
  });

  return {
    ...res,
    data: res.data as unknown as string,
  };
}
