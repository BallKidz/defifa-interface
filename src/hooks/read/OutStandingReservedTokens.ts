import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { usePublicClient } from "wagmi";
import { useChainData } from "../useChainData";
import { DefifaConfig } from "config/types";
import { Abi } from "viem";

export function useOutstandingNumber() {
  const publicClient = usePublicClient();
  const { chainData } = useChainData();
  
  // Convert publicClient to ethers provider for backward compatibility
  const provider = publicClient ? new ethers.providers.JsonRpcProvider(
    publicClient.transport.url || `https://eth.llamarpc.com`,
    publicClient.chain?.id
  ) : null;

  const [outstandingNumbers, setOutstandingNumbers] = useState<
    JBTiered721MintReservesForTiersData[]
  >([{ tierId: 0, count: 0 }]);

  useEffect(() => {
    if (provider) {
      getOutstandingNumberForAllTiers(provider, chainData).then((data) => {
        setOutstandingNumbers(data);
      });
    }
  }, [provider, chainData]);

  return outstandingNumbers;
}
export interface JBTiered721MintReservesForTiersData {
  tierId: number;
  count: number;
}

export function getOutstandingNumberForAllTiers(
  provider: ethers.providers.Provider,
  chainData: DefifaConfig,
  dataSourceAddress?: string
): Promise<JBTiered721MintReservesForTiersData[]> {
  const contract = new ethers.Contract(
    chainData.JBTiered721DelegateStore.address,
    chainData.JBTiered721DelegateStore.interface,
    provider
  );
  const tiers = Array.from(Array(32).keys()).map((i) => i + 1);
  const outstandingNumberForAllTiers = Promise.all(
    tiers.map(async (tier) => {
      try {
        const num =
          await contract.numberOfReservedTokensOutstandingFor(
            dataSourceAddress,
            tier
          );
        const res = { tierId: tier, count: Number(num) };

        return res;
      } catch (error) {
        return { tierId: 0, count: 0 };
      }
    })
  );
  return outstandingNumberForAllTiers;
}
