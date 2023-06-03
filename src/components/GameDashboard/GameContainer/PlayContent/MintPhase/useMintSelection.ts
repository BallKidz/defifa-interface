import { useState } from "react";

export interface TierSelection {
  [tierId: string]: {
    count: number;
  };
}

export function useMintSelection() {
  const [selectedTiers, setSelectedTiers] = useState<TierSelection>();

  const totalSelected = Object.values(selectedTiers ?? {}).reduce(
    (acc, curr) => acc + curr.count,
    0
  );

  function incrementTierSelection(tierId: string) {
    setSelectedTiers((prev) => {
      const prevCount = prev?.[tierId]?.count ?? 0;

      return {
        ...prev,
        [tierId]: {
          count: prevCount + 1,
        },
      };
    });
  }

  function decrementTierSelection(tierId: string) {
    setSelectedTiers((prev) => {
      if (!prev?.[tierId]) {
        return;
      }
      const prevCount = prev[tierId].count;

      return {
        ...prev,
        [tierId]: {
          count: prevCount - 1,
        },
      };
    });
  }

  return {
    selectedTiers,
    totalSelected,
    incrementTierSelection,
    decrementTierSelection,
  };
}
