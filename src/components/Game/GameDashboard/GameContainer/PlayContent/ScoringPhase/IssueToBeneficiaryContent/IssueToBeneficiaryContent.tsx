import { useEffect, useMemo } from "react";
import { useGameContext } from "contexts/GameContext";
import { useOutstandingNumber } from "hooks/read/OutStandingReservedTokens";
import { useMintSelectedReserves } from "hooks/write/useMintSelectedReserves";
import { ActionContainer } from "components/Game/GameDashboard/GameContainer/ActionContainer/ActionContainer";
import { ReservedTierCard } from "./ReservedTierCard";
import { useReserveSelection } from "./useReserveSelection";
import { useMiniAppHaptics } from "hooks/useMiniAppHaptics";

export function IssueToBeneficiaryContent() {
  console.log('[IssueToBeneficiaryContent] Component rendering...');
  
  const { gameId, currentFundingCycle, nfts } = useGameContext();
  console.log('[IssueToBeneficiaryContent] gameId:', gameId);
  console.log('[IssueToBeneficiaryContent] currentFundingCycle:', currentFundingCycle);
  console.log('[IssueToBeneficiaryContent] nfts:', nfts);
  
  const dataSourceAddress = currentFundingCycle?.metadata.dataSource;
  
  console.log('[IssueToBeneficiaryContent] dataSourceAddress:', dataSourceAddress);
  
  console.log('[IssueToBeneficiaryContent] About to call useReserveSelection...');
  const {
    selectedTiers,
    incrementTierSelection,
    decrementTierSelection,
    totalSelected,
    clearSelection,
  } = useReserveSelection();
  console.log('[IssueToBeneficiaryContent] useReserveSelection completed');
  
  const { write, isLoading, isSuccess, isError, disabled } = useMintSelectedReserves(
    selectedTiers,
    dataSourceAddress || ""
  );
  const { triggerImpact, triggerSelection } = useMiniAppHaptics();

  // Get the actual tiers from the game context
  const gameTiers = useMemo(
    () => nfts?.tiers ?? [],
    [nfts?.tiers]
  );
  console.log('[IssueToBeneficiaryContent] gameTiers:', gameTiers);
  
  // Get tier IDs (1-indexed)
  const tierIds = gameTiers.map((_, index) => index + 1);
  console.log('[IssueToBeneficiaryContent] tierIds:', tierIds);
  
  // Get reserved token counts for the actual tiers
  const {
    data: outstandingReserves,
    isLoading: outstandingLoading,
    isFetching: outstandingFetching,
  } = useOutstandingNumber(dataSourceAddress, tierIds);
  console.log('[IssueToBeneficiaryContent] outstandingReserves:', outstandingReserves);
  
  // Create tier data with reserved token counts
  const availableTiers = useMemo(() => {
    return gameTiers.map((tier, index) => {
      const tierId = index + 1; // tiers are 0-indexed, tierId is 1-indexed
      const reservedData = outstandingReserves.find(r => r.tierId === tierId);
      return {
        tierId,
        count: reservedData?.count || 0,
        tier,
      };
    });
  }, [gameTiers, outstandingReserves]);
  
  console.log('[IssueToBeneficiaryContent] availableTiers:', availableTiers);

  const tiersWithReserves = useMemo(
    () => availableTiers.filter((tier) => tier.count > 0),
    [availableTiers]
  );

  const handleMint = () => {
    if (totalSelected > 0) {
      void triggerImpact("medium");
      write();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      clearSelection();
    }
  }, [isSuccess, clearSelection]);

  useEffect(() => {
    if (tiersWithReserves.length === 0 && totalSelected > 0) {
      clearSelection();
    }
  }, [tiersWithReserves.length, totalSelected, clearSelection]);

  const shouldShowLoadingState =
    (outstandingLoading || outstandingFetching) &&
    (tierIds?.length ?? 0) > 0 &&
    outstandingReserves.length === 0;

  if (!dataSourceAddress) {
    return (
      <div className="p-4 text-center">
        <div className="text-neutral-400">No data source configured for this game.</div>
      </div>
    );
  }

  // Show loading state if we don't have data yet
  if (shouldShowLoadingState) {
    return (
      <div className="p-4 text-center">
        <div className="text-neutral-400">Loading reserved tokens...</div>
      </div>
    );
  }

  if (tiersWithReserves.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="text-neutral-400">No reserved tokens are available to mint right now.</div>
      </div>
    );
  }

  return (
    <ActionContainer
      renderActions={() => (
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">Mint Reserved Tokens</div>
          <div className="text-sm text-neutral-400">
            {totalSelected > 0 
              ? `Selected ${totalSelected} reserved token${totalSelected === 1 ? '' : 's'} to mint`
              : 'Select reserved tokens to mint'
            }
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleMint}
              disabled={disabled || totalSelected === 0 || isLoading}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Minting...' : 'Mint Reserved Tokens'}
            </button>
            {totalSelected > 0 && (
              <button
                onClick={() => {
                  void triggerSelection();
                  clearSelection();
                }}
                className="px-4 py-2 bg-neutral-600 text-white rounded-md hover:bg-neutral-700"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 pt-2">
        {tiersWithReserves.map((tierData) => (
            <ReservedTierCard
              key={tierData.tierId}
              tierId={tierData.tierId}
              reservedCount={tierData.count}
              selectedCount={selectedTiers[tierData.tierId.toString()] || 0}
              onIncrement={() => incrementTierSelection(tierData.tierId.toString())}
              onDecrement={() => decrementTierSelection(tierData.tierId.toString())}
            />
          ))}
      </div>
    </ActionContainer>
  );
}
