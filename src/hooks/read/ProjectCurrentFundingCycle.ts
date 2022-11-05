import { useContractRead, useNetwork } from "wagmi";
import JBControllerGoerli from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBController.json";
import JBControllerMainnet from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBController.json";
import {
  DEFIFA_PROJECT_ID_GOERLI,
  DEFIFA_PROJECT_ID_MAINNET,
} from "../../constants/constants";

export function useProjectCurrentFundingCycle() {
  const { chain } = useNetwork();
  const { JBController, projectId } =
    chain?.name === "mainnet"
      ? {
          JBController: JBControllerMainnet,
          projectId: DEFIFA_PROJECT_ID_MAINNET,
        }
      : {
          JBController: JBControllerGoerli,
          projectId: DEFIFA_PROJECT_ID_GOERLI,
        };

  return useContractRead({
    addressOrName: JBController.address,
    contractInterface: JBController.abi,
    functionName: "currentFundingCycleOf",
    args: projectId,
  });
}
