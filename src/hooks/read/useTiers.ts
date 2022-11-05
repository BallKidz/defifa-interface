import { constants } from "ethers";
import { useContractRead } from "wagmi";
import { V3ContractName } from "../../models/contracts";
import { useLoadV2V3Contract } from "../LoadV2V3Contract";

export function useNftRewardTiersOf(dataSourceAddress: string | undefined) {
  const JBTiered721DelegateStore = useLoadV2V3Contract({
    contractName: V3ContractName.JBTiered721DelegateStore,
  });

  const hasDataSource =
    dataSourceAddress && dataSourceAddress !== constants.AddressZero;

  return useContractRead({
    addressOrName: JBTiered721DelegateStore?.address ?? "",
    contractInterface: JBTiered721DelegateStore?.interface ?? "",
    functionName: "tiers",
    args: hasDataSource ? [dataSourceAddress, 0, 32] : null,
  });
}
