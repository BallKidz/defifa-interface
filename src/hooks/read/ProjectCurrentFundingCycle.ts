import { useContractRead, useNetwork } from "wagmi";
import JBControllerGoerli from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBController.json";
import JBControllerMainnet from "@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBController.json";
import {
  DEFIFA_PROJECT_ID_GOERLI,
  DEFIFA_PROJECT_ID_MAINNET,
} from "../../constants/constants";
import { getChainData } from "../../constants/addresses";

export function useProjectCurrentFundingCycle() {
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);

  const { JBController, projectId } = chainData;

  return useContractRead({
    addressOrName: JBController.address,
    contractInterface: JBController.abi,
    functionName: "currentFundingCycleOf",
    args: projectId,
    chainId:chainData.chainId,
    onSuccess:(data) =>{
      console.log("SSSSS")
      console.log(JBController.address)
      console.log(data);
    },
    onError: (error) => {
      console.log("FFFF")
      console.log(chainData.chainId)
      console.log(error)
    }

  });
}
