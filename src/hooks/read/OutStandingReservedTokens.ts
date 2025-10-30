import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { useChainData } from "../useChainData";
import { Abi } from "viem";

export interface OutstandingReserve {
  tierId: number;
  count: number;
}

export interface UseOutstandingNumberResult {
  data: OutstandingReserve[];
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  error: unknown;
}

export function useOutstandingNumber(
  dataSourceAddress?: string,
  tierIds?: number[]
): UseOutstandingNumberResult {
  console.log('[useOutstandingNumber] Hook called with dataSourceAddress:', dataSourceAddress, 'tierIds:', tierIds);
  const { chainData } = useChainData();
  const storeAddress = chainData.JBTiered721DelegateStore.address as `0x${string}`;
  const storeInterface = chainData.JBTiered721DelegateStore.interface as Abi;
  const { chainId } = chainData;
  
  console.log('[useOutstandingNumber] chainData:', !!chainData);
  console.log('[useOutstandingNumber] Store address:', storeAddress);

  const enabled = Boolean(
    dataSourceAddress &&
    tierIds &&
    tierIds.length > 0 &&
    storeAddress
  );

  const contracts = useMemo(() => {
    if (!enabled || !tierIds) {
      return [];
    }

    return tierIds.map((tierId) => {
      console.log(`[useOutstandingNumber] Creating contract config for tier ${tierId} with dataSourceAddress ${dataSourceAddress}`);

      return {
        address: storeAddress,
        abi: storeInterface,
        functionName: "numberOfPendingReservesFor",
        args: [dataSourceAddress as `0x${string}`, BigInt(tierId)] as const,
        chainId,
      };
    });
  }, [
    enabled,
    tierIds,
    storeAddress,
    storeInterface,
    chainId,
    dataSourceAddress,
  ]);

  const scopeKey = useMemo(() => {
    if (!dataSourceAddress || !tierIds?.length) return undefined;
    return `outstanding-reserves-${dataSourceAddress}-${tierIds.join("-")}`;
  }, [dataSourceAddress, tierIds]);

  const {
    data,
    error,
    isLoading,
    isFetching,
    isSuccess,
  } = useReadContracts({
    contracts,
    scopeKey,
    query: {
      enabled,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
    },
  });

  if (error) {
    console.error('[useOutstandingNumber] useReadContracts error:', error);
  }

  console.log('[useOutstandingNumber] Query status:', {
    isLoading,
    isFetching,
    isSuccess,
    hasData: !!data,
  });

  // Process the results directly without useEffect
  const outstandingNumbers = useMemo(() => {
    if (!tierIds || tierIds.length === 0) {
      return [];
    }

    return tierIds.map((tierId, index) => {
      const item = data?.[index];

      let count = 0;
      let itemError: unknown = undefined;

      if (item && typeof item === "object" && "status" in item) {
        if (item.status === "success" && item.result !== undefined) {
          count = Number(item.result);
        } else {
          itemError = item.error;
        }
      } else if (item !== undefined) {
        count = Number(item);
      }

      console.log(`[useOutstandingNumber] Tier ${tierId}:`, {
        count,
        error: itemError instanceof Error ? itemError.message : itemError,
        rawData: item,
      });

      return {
        tierId,
        count,
      };
    });
  }, [data, tierIds]);

  const expectedResults = tierIds?.length ?? 0;
  const hasCompleteData = !enabled || (data && data.length >= expectedResults);
  const derivedLoading = enabled && !hasCompleteData;

  console.log('[useOutstandingNumber] Final results:', {
    outstandingNumbers,
    hasCompleteData,
    derivedLoading,
  });

  return {
    data: outstandingNumbers,
    isLoading: Boolean(derivedLoading || isLoading),
    isFetching: Boolean(isFetching),
    isSuccess,
    error,
  };
}
