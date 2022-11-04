import { useContractRead } from "wagmi";
import JBController from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBController.json";

export function useProjectCurrentFundingCycle({
  projectId,
}: {
  projectId?: number;
}) {
  return useContractRead({
    addressOrName: JBController.address,
    contractInterface: JBController.abi,
    functionName: "currentFundingCycleOf",
    args: projectId ? [projectId] : null,
  });
}
