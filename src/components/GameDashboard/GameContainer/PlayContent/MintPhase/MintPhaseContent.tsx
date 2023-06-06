import Container from "components/layout/Container";
import { useState } from "react";
import { twJoin } from "tailwind-merge";
import { MintPicksContent } from "./MintPicksContent";
import { RefundPicksContent } from "./RefundPicksContent";

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
                  ? "underline font-medium text-neutral-50"
                  : "text-neutral-400",
                "cursor-pointer hover:text-neutral-300"
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
                  ? "underline font-medium text-neutral-50"
                  : "text-neutral-400",
                "cursor-pointer hover:text-neutral-300"
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
