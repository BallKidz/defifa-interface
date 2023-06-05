import Container from "components/UI/Container";
import { useState } from "react";
import { twJoin } from "tailwind-merge";
import { RefundPicksContent } from "../MintPhase/RefundPicksContent";

export function RefundPhaseContent() {
  const [selectedTab, setSelectedTab] = useState<"refund">("refund");

  return (
    <div>
      <Container>
        <ul className="flex gap-8 mb-6 text-lg">
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

      <RefundPicksContent />
    </div>
  );
}
