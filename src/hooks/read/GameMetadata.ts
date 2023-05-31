import axios from "axios";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "react-query";
import { JBProjectMetadata } from "types/interfaces";
import { getIpfsUrl } from "utils/ipfs";
import { useContractRead } from "wagmi";

const METADATA_DOMAIN = 0;

export function useGameMetadata(projectId: number) {
  const { chainData } = useChainData();

  const { data: metadataCid } = useContractRead({
    addressOrName: chainData.JBProjects.address,
    contractInterface: chainData.JBProjects.interface,
    functionName: "metadataContentOf",
    args: [projectId, METADATA_DOMAIN],
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
