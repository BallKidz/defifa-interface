import Container from "components/layout/Container";
import { useState } from "react";
import { twJoin } from "tailwind-merge";
import { RedeemPicksContent } from "./RedeemPicksContent";

export function CompletePhaseContent() {
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
              Redeem
            </a>
          </li>
        </ul>
      </Container>

      <RedeemPicksContent />
    </div>
  );
}
