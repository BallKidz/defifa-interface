import Container from "components/layout/Container";
import { useCallback, useEffect, useMemo, useState } from "react";
import { twJoin } from "tailwind-merge";
import { CustomScorecardContent } from "./CustomScorecardContent/CustomScorecardContent";
import { ScorecardsContent } from "./ScorecardsContent/ScorecardsContent";
import { RefundPicksContent } from "../MintPhase/RefundPicksContent";
import { IssueToBeneficiaryContent } from "./IssueToBeneficiaryContent/IssueToBeneficiaryContent";
import { useGameContext } from "contexts/GameContext";
import { useOutstandingNumber } from "hooks/read/OutStandingReservedTokens";
import { useMiniAppHaptics } from "hooks/useMiniAppHaptics";
import { useFarcasterContext } from "hooks/useFarcasterContext";
import { useMediaQuery } from "../../../../../../hooks/useMediaQuery";

export function ScoringPhaseContent() {
  const [selectedTab, setSelectedTab] = useState<
    "scorecards" | "customscorecard" | "mypicks" | "issuetobeneficiary"
  >("scorecards");
  const { currentFundingCycle, nfts } = useGameContext();
  const dataSourceAddress = currentFundingCycle?.metadata.dataSource;
  const gameTiers = useMemo(() => nfts?.tiers ?? [], [nfts?.tiers]);
  const tierIds = useMemo(
    () => gameTiers.map((_, index) => index + 1),
    [gameTiers]
  );
  const {
    data: outstandingReserves,
    isLoading: outstandingLoading,
    isFetching: outstandingFetching,
  } = useOutstandingNumber(dataSourceAddress, tierIds);
  const hasAnyReserves = outstandingReserves.some((item) => item.count > 0);
  const showIssueTab = outstandingLoading || outstandingFetching || hasAnyReserves;
  const { triggerSelection } = useMiniAppHaptics();
  const { isInMiniApp } = useFarcasterContext();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const canShowIssueTab = showIssueTab && !isInMiniApp && isDesktop;

  const handleSelect = useCallback(
    (tab: "scorecards" | "customscorecard" | "mypicks" | "issuetobeneficiary") => {
      setSelectedTab(tab);
      void triggerSelection();
    },
    [triggerSelection]
  );

  useEffect(() => {
    if (!showIssueTab && selectedTab === "issuetobeneficiary") {
      setSelectedTab("scorecards");
    }
  }, [showIssueTab, selectedTab]);

  return (
    <div>
      <ul className="flex gap-2 mb-6 text-sm">
        <li className="flex-1 min-w-[0]">
          <button
            className={twJoin(
              selectedTab === "mypicks"
                ? "bg-neutral-800 text-neutral-50"
                : "text-neutral-400",
              "cursor-pointer hover:text-neutral-300 px-4 py-2 rounded-md w-full text-left"
            )}
            onClick={() => handleSelect("mypicks")}
          >
            My positions
          </button>
        </li>
        <li className="flex-1 min-w-[0]">
          <button
            className={twJoin(
              selectedTab === "customscorecard"
                ? "bg-neutral-800 text-neutral-50"
                : "text-neutral-400",
              "cursor-pointer hover:text-neutral-300 px-4 py-2 rounded-md w-full text-left"
            )}
            onClick={() => handleSelect("customscorecard")}
          >
            Propose scorecard
          </button>
        </li>
        <li className="flex-1 min-w-[0]">
          <button
            className={twJoin(
              selectedTab === "scorecards"
                ? "bg-neutral-800 text-neutral-50"
                : "text-neutral-400",
              "cursor-pointer hover:text-neutral-300 px-4 py-2 rounded-md w-full text-left"
            )}
            onClick={() => handleSelect("scorecards")}
          >
            Vote on scorecard
          </button>
        </li>
        {canShowIssueTab && (
          <li className="flex-1 min-w-[0]">
            <button
              className={twJoin(
                selectedTab === "issuetobeneficiary"
                  ? "bg-neutral-800 text-neutral-50"
                  : "text-neutral-400",
                "cursor-pointer hover:text-neutral-300 px-4 py-2 rounded-md w-full text-left"
              )}
              onClick={() => handleSelect("issuetobeneficiary")}
            >
              Issue to Beneficiary
            </button>
          </li>
        )}
      </ul>
      {selectedTab === "scorecards" ? (
        <ScorecardsContent />
      ) : selectedTab === "customscorecard" ? (
        <CustomScorecardContent />
      ) : selectedTab === "issuetobeneficiary" && canShowIssueTab ? (
        <div className="p-4">
          <p className="text-neutral-400 mb-4">
            This game has been configured to reserve NFTs.
          </p>
          <IssueToBeneficiaryContent />
        </div>
      ) : (
        <RefundPicksContent disabled />
      )}
    </div>
  );
}
