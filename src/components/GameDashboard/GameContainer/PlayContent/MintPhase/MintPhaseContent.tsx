import { useState } from "react";
import { twJoin } from "tailwind-merge";
import { MintPicksContent } from "./MintPicksContent";
import { RefundPicksContent } from "./RefundPicksContent";

export function MintPhaseContent() {
  const [selectedTab, setSelectedTab] = useState<"mint" | "refund">("mint");

  return (
    <div>
      <div className="col-span-2">
        <ul className="flex gap-2 mb-6 text-sm">
          <li>
            <a
              className={twJoin(
                selectedTab === "mint"
                  ? "bg-neutral-800 text-neutral-50 rounded-md"
                  : "text-neutral-400",
                "cursor-pointer hover:text-neutral-300 px-4 py-2"
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
                  ? "bg-neutral-800 text-neutral-50 rounded-md"
                  : "text-neutral-400",
                "cursor-pointer hover:text-neutral-300 px-4 py-2"
              )}
              onClick={() => setSelectedTab("refund")}
            >
              Refund
            </a>
          </li>
        </ul>

        {selectedTab === "mint" ? <MintPicksContent /> : <RefundPicksContent />}
      </div>
    </div>
  );
}
