import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { MintPicksContent } from "./MintPicksContent";
import { RefundPicksContent } from "./RefundPicksContent";
import { IssueToBeneficiaryContent } from "../ScoringPhase/IssueToBeneficiaryContent/IssueToBeneficiaryContent";
import { useGameContext } from "contexts/GameContext";
import { useOutstandingNumber } from "hooks/read/OutStandingReservedTokens";

export function MintPhaseContent() {
  const [activeTab, setActiveTab] = useState<"mint" | "refund" | "issue">("mint");
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
    if (!showIssueTab && activeTab === "issue") {
      setActiveTab("mint");
    }
  }, [showIssueTab, activeTab]);

  return (
    <div>
      <nav className="border-b border-neutral-900 pb-2 mb-5">
        <ul className="flex gap-8 text-base">
          <li>
            <a
              className={twMerge(
                "hover:text-neutral-50 cursor-pointer py-2",
                activeTab === "mint"
                  ? "text-neutral-50 border-b border-neutral-50 "
                  : "text-neutral-400"
              )}
              onClick={() => setActiveTab("mint")}
            >
              Mint
            </a>
          </li>

          <li>
            <a
              className={twMerge(
                "hover:text-neutral-50 cursor-pointer py-2",
                activeTab === "refund"
                  ? "text-neutral-50 border-b border-neutral-50 "
                  : "text-neutral-400"
              )}
              onClick={() => setActiveTab("refund")}
            >
              Refund
            </a>
          </li>
          {showIssueTab && (
            <li>
              <a
                className={twMerge(
                  "hover:text-neutral-50 cursor-pointer py-2",
                  activeTab === "issue"
                    ? "text-neutral-50 border-b border-neutral-50 "
                    : "text-neutral-400"
                )}
                onClick={() => setActiveTab("issue")}
              >
                Issue to Beneficiary
              </a>
            </li>
          )}
        </ul>
      </nav>

      {activeTab === "mint" ? (
        <MintPicksContent />
      ) : activeTab === "refund" ? (
        <RefundPicksContent />
      ) : showIssueTab ? (
        <div className="mt-4">
          <IssueToBeneficiaryContent />
        </div>
      ) : null}
    </div>
  );
}
