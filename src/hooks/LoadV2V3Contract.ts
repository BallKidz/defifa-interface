import { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import { V3ContractName } from "../models/contracts";
import {
  ContractJson,
  loadV2V3Contract,
} from "../utils/contractLoaders/loadV2V3Contract";
import { useLoadContractFromAddress } from "./LoadContractFromAddress";

/**
 * Load a JB V2 or V3 contract, depending on the given [cv].
 *
 * (optional) If [address] is provided, load the contract at that address.
 */
export const useLoadV2V3Contract = ({
  contractName,
  chain,
  address,
}: {
  contractName: V3ContractName;
  chain: string;
  address?: string; // optional address, to override the default address
}) => {
  const { data: signer, isError, isLoading } = useSigner();
  const [contractJson, setContractJson] = useState<ContractJson>();

  useEffect(() => {
    async function loadAbi() {
      if (!signer) return;

      const contractJson = await loadV2V3Contract(contractName, chain, signer);

      setContractJson({
        address: address ?? contractJson?.address,
        abi: contractJson?.interface,
      });
    }

    loadAbi();
  }, [contractName, address, signer, chain]);

  return useLoadContractFromAddress({
    address: contractJson?.address,
    abi: contractJson?.abi,
  });
};
