import { useState } from "react";

export function useReserveSelection() {
  console.log('[useReserveSelection] Hook called');
  const [selectedTiers, setSelectedTiers] = useState<{ [tierId: string]: number }>({});
  
  const totalSelected = Object.values(selectedTiers).reduce(
    (acc, curr) => acc + curr,
    0
  );
  
  console.log('[useReserveSelection] selectedTiers:', selectedTiers);
  console.log('[useReserveSelection] totalSelected:', totalSelected);

  function clearSelection() {
    setSelectedTiers({});
  }

  function incrementTierSelection(tierId: string) {
    setSelectedTiers((prev) => {
      const prevCount = prev[tierId] || 0;
      return {
        ...prev,
        [tierId]: prevCount + 1,
      };
    });
  }

  function decrementTierSelection(tierId: string) {
    setSelectedTiers((prev) => {
      const prevCount = prev[tierId] || 0;
      if (prevCount <= 1) {
        const newState = { ...prev };
        delete newState[tierId];
        return newState;
      }
      return {
        ...prev,
        [tierId]: prevCount - 1,
      };
    });
  }

  return {
    selectedTiers,
    totalSelected,
    incrementTierSelection,
    decrementTierSelection,
    clearSelection,
  };
}
