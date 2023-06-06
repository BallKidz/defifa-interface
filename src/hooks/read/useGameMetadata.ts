import axios from "axios";
import { JUICEBOX_PROJECT_METADATA_DOMAIN } from "constants/constants";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "react-query";
import { JBProjectMetadata } from "types/interfaces";
import { getIpfsUrl } from "utils/ipfs";
import { useContractRead } from "wagmi";

export function useGameMetadata(projectId: number) {
  const { chainData } = useChainData();

  const { data: metadataCid } = useContractRead({
    addressOrName: chainData.JBProjects.address,
    contractInterface: chainData.JBProjects.interface,
    functionName: "metadataContentOf",
    args: [projectId, JUICEBOX_PROJECT_METADATA_DOMAIN],
    chainId: chainData.chainId,
  });

  return useQuery(
    ["metadata", metadataCid],
    async () => {
      if (!metadataCid || typeof metadataCid !== "string") return;

      const res = await axios.get<JBProjectMetadata>(getIpfsUrl(metadataCid));
      return res.data;
    },
    {
      enabled: !!metadataCid,
    }
  );
}
