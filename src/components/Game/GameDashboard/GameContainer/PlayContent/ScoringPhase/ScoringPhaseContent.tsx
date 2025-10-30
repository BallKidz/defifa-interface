import Container from "components/layout/Container";
import { useEffect, useMemo, useState } from "react";
import { twJoin } from "tailwind-merge";
import { CustomScorecardContent } from "./CustomScorecardContent/CustomScorecardContent";
import { ScorecardsContent } from "./ScorecardsContent/ScorecardsContent";
import { RefundPicksContent } from "../MintPhase/RefundPicksContent";
import { IssueToBeneficiaryContent } from "./IssueToBeneficiaryContent/IssueToBeneficiaryContent";
import { useGameContext } from "contexts/GameContext";
import { useOutstandingNumber } from "hooks/read/OutStandingReservedTokens";

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

  useEffect(() => {
    if (!showIssueTab && selectedTab === "issuetobeneficiary") {
      setSelectedTab("scorecards");
    }
  }, [showIssueTab, selectedTab]);

  return (
    <div>
      <ul className="flex gap-2 mb-6 text-sm">
        <li>
          <a
            className={twJoin(
              selectedTab === "mypicks"
                ? "bg-neutral-800 text-neutral-50 rounded-md"
                : "text-neutral-400",
              "cursor-pointer hover:text-neutral-300 px-4 py-2"
            )}
            onClick={() => setSelectedTab("mypicks")}
          >
            My Positions
          </a>
        </li>
        <li>
          <a
            className={twJoin(
              selectedTab === "customscorecard"
                ? "bg-neutral-800 text-neutral-50 rounded-md"
                : "text-neutral-400",
              "cursor-pointer hover:text-neutral-300 px-4 py-2"
            )}
            onClick={() => setSelectedTab("customscorecard")}
          >
            Propose a Scorecard
          </a>
        </li>
        <li>
          <a
            className={twJoin(
              selectedTab === "scorecards"
                ? "bg-neutral-800 text-neutral-50 rounded-md"
                : "text-neutral-400",
              "cursor-pointer hover:text-neutral-300 px-4 py-2"
            )}
            onClick={() => setSelectedTab("scorecards")}
          >
            Vote on Scorecard
          </a>
        </li>
        {showIssueTab && (
          <li>
            <a
              className={twJoin(
                selectedTab === "issuetobeneficiary"
                  ? "bg-neutral-800 text-neutral-50 rounded-md"
                  : "text-neutral-400",
                "cursor-pointer hover:text-neutral-300 px-4 py-2"
              )}
              onClick={() => setSelectedTab("issuetobeneficiary")}
            >
              Issue to Beneficiary
            </a>
          </li>
        )}
      </ul>
      {selectedTab === "scorecards" ? (
        <ScorecardsContent />
      ) : selectedTab === "customscorecard" ? (
        <CustomScorecardContent />
      ) : selectedTab === "issuetobeneficiary" && showIssueTab ? (
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Issue to Beneficiary</h3>
          <p className="text-neutral-400 mb-4">
            Mint reserved NFTs to the addresses configured for each tier.
          </p>
          <IssueToBeneficiaryContent />
        </div>
      ) : (
        <RefundPicksContent disabled />
      )}
    </div>
  );
}
