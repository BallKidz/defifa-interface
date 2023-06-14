import Container from "components/layout/Container";
import { useState } from "react";
import { twJoin } from "tailwind-merge";
import { RefundPicksContent } from "../MintPhase/RefundPicksContent";

export function RefundPhaseContent() {
  const [selectedTab, setSelectedTab] = useState<"refund">("refund");

  return (
    <div>
      <RefundPicksContent />
    </div>
  );
}
