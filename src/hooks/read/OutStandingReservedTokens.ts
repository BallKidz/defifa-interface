import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useProvider } from "wagmi";
import { useChainData } from "../useChainData";

export function useOutstandingNumber() {
  const provider = useProvider();
  const { chainData } = useChainData();

  const [outstandingNumbers, setOutstandingNumbers] = useState<
    JBTiered721MintReservesForTiersData[]
  >([{ tierId: 0, count: 0 }]);

  useEffect(() => {
    getOutstandingNumberForAllTiers(provider, chainData).then((data) => {
      setOutstandingNumbers(data);
    });
  }, [provider]);

  return outstandingNumbers;
}
export interface JBTiered721MintReservesForTiersData {
  tierId: number;
  count: number;
}

export function getOutstandingNumberForAllTiers(
  provider: ethers.providers.Provider,
  chainData: any
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
        const num: BigNumber =
          await contract.numberOfReservedTokensOutstandingFor(
            chainData.defifaDelegate.address,
            tier
          );
        const res = { tierId: tier, count: num.toNumber() };

        return res;
      } catch (error) {
        return { tierId: 0, count: 0 };
      }
    })
  );
  return outstandingNumberForAllTiers;
}
