import { useContractRead, useNetwork } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function useGameMetadata() {
  const network = useNetwork();

  const chainData = getChainData(network?.chain?.id);
  const address = chainData.JBProjects.address // type error to do
  console.log("address", address)
  const gameId = chainData.projectId
  return useContractRead({
    addressOrName: address, //0x21263a042aFE4bAE34F08Bb318056C181bD96D3b
    contractInterface: chainData.JBProjects.interface,
    functionName: "metadataContentOf",
    args: [gameId,0],
    chainId: chainData.chainId,
  });
}