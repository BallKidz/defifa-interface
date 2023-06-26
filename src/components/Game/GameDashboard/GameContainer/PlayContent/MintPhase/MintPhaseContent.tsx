import { useState } from "react";
import { twJoin, twMerge } from "tailwind-merge";
import { MintPicksContent } from "./MintPicksContent";
import { RefundPicksContent } from "./RefundPicksContent";
import Container from "components/layout/Container";

export function MintPhaseContent() {
  const [activeTab, setActiveTab] = useState<"mint" | "refund">("mint");

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
        </ul>
      </nav>

      {activeTab === "mint" ? <MintPicksContent /> : <RefundPicksContent />}
    </div>
  );
}
