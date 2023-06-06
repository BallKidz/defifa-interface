import Container from "components/layout/Container";
import { useState } from "react";
import { twJoin } from "tailwind-merge";
import { CustomScorecardContent } from "./CustomScorecardContent/CustomScorecardContent";
import { ScorecardsContent } from "./ScorecardsContent/ScorecardsContent";
import { RefundPicksContent } from "../MintPhase/RefundPicksContent";

export function ScoringPhaseContent() {
  const [selectedTab, setSelectedTab] = useState<
    "scorecards" | "customscorecard" | "mypicks"
  >("scorecards");

  return (
    <div>
      <Container>
        <ul className="flex gap-8 mb-6 text-lg">
          <li>
            <a
              className={twJoin(
                selectedTab === "scorecards"
                  ? "underline font-medium text-neutral-50"
                  : "text-neutral-400",
                "cursor-pointer hover:text-neutral-300"
              )}
              onClick={() => setSelectedTab("scorecards")}
            >
              Scorecards
            </a>
          </li>
          <li>
            <a
              className={twJoin(
                selectedTab === "customscorecard"
                  ? "underline font-medium text-neutral-50"
                  : "text-neutral-400",
                "cursor-pointer hover:text-neutral-300"
              )}
              onClick={() => setSelectedTab("customscorecard")}
            >
              Submit scorecard
            </a>
          </li>
          <li>
            <a
              className={twJoin(
                selectedTab === "mypicks"
                  ? "underline font-medium text-neutral-50"
                  : "text-neutral-400",
                "cursor-pointer hover:text-neutral-300"
              )}
              onClick={() => setSelectedTab("mypicks")}
            >
              My picks
            </a>
          </li>
        </ul>
      </Container>
      {selectedTab === "scorecards" ? (
        <ScorecardsContent />
      ) : selectedTab === "customscorecard" ? (
        <CustomScorecardContent />
      ) : (
        <RefundPicksContent disabled />
      )}
    </div>
  );
}
