import { useContractRead, useNetwork } from "wagmi";
import { useChainData } from "hooks/useChainData";

export function useGameName(dataSource: string) {
  const { chainData } = useChainData();

  const { data: gameName } = useContractRead({
    addressOrName: dataSource,
    contractInterface: chainData.DefifaDeployer.interface,
    functionName: "name",
    chainId: chainData.chainId,
  });

  return gameName;
}