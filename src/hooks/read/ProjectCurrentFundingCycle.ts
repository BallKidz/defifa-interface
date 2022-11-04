import { useContractRead, useNetwork } from "wagmi";
import JBControllerGoerli from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBController.json";
import JBControllerMainnet from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBController.json";

export function useProjectCurrentFundingCycle({
  projectId,
}: {
  projectId?: number;
}) {
  const { chain } = useNetwork();
  const JBController =
    chain?.name === "mainnet" ? JBControllerMainnet : JBControllerGoerli;
  return useContractRead({
    addressOrName: JBController.address,
    contractInterface: JBController.abi,
    functionName: "currentFundingCycleOf",
    args: projectId ? [projectId] : null,
  });
}
