import Button from "components/UI/Button";
import { useGameContext } from "contexts/GameContext";
import { ActionContainer } from "../../ActionContainer/ActionContainer";
import { MintCard } from "./MintCard";
import { useState } from "react";
import { useMintSelection } from "./useMintSelection";
import { MintActions } from "./MintActions";
import Container from "components/UI/Container";
import { MintPicksContent } from "./MintPicks";
import { RefundPicksContent } from "./RefundPicks";
import { twJoin } from "tailwind-merge";

export function MintPhaseContent() {
  const [selectedTab, setSelectedTab] = useState<"mint" | "refund">("mint");

  return (
    <div>
      <Container>
        <ul className="flex gap-8 mb-6 text-lg">
          <li>
            <a
              className={twJoin(
                selectedTab === "mint"
                  ? "underline font-medium text-gray-50"
                  : "text-gray-400",
                "cursor-pointer hover:text-gray-300"
              )}
              onClick={() => setSelectedTab("mint")}
            >
              Mint
            </a>
          </li>
          <li>
            <a
              className={twJoin(
                selectedTab === "refund"
                  ? "underline font-medium text-gray-50"
                  : "text-gray-400",
                "cursor-pointer hover:text-gray-300"
              )}
              onClick={() => setSelectedTab("refund")}
            >
              My picks
            </a>
          </li>
        </ul>
      </Container>
      {selectedTab === "mint" ? <MintPicksContent /> : <RefundPicksContent />}
    </div>
  );
}
