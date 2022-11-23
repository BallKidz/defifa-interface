import { BigNumber, ethers } from "ethers";
import { useContractRead, useProvider } from "wagmi";
import { getChainData } from "../../constants/addresses";

export function useOutstandingNumber() {
  const provider = useProvider();
  getOutstandingNumberForAllTiers(provider);
  return () => getOutstandingNumberForAllTiers(provider);
}
export interface JBTiered721MintReservesForTiersData {
  tierId: number;
  count: number;
}

export function getOutstandingNumberForAllTiers(
  provider: ethers.providers.Provider
): Promise<JBTiered721MintReservesForTiersData[]> {
  const chainData = getChainData();

  const contract = new ethers.Contract(
    chainData.JBTiered721DelegateStore.address,
    chainData.JBTiered721DelegateStore.interface,
    provider
  );
  const tiers = Array.from(Array(32).keys()).map((i) => i + 1);
  const outstandingNumberForAllTiers = Promise.all(
    tiers.map(async (tier) => {
      const num: BigNumber =
        await contract.numberOfReservedTokensOutstandingFor(
          chainData.defifaDelegate,
          tier
        );
      const res = { tierId: tier, count: num.toNumber() };
      return res;
    })
  );
  return outstandingNumberForAllTiers;
}
