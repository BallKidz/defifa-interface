"use client";

import { OutcomeCell, GridState } from "types/scoresquare";
import { isLiveLeader } from "utils/scoresquare";

interface GridCellProps {
  cell: OutcomeCell;
  gs: GridState;
  onMint: (cell: OutcomeCell) => void;
  me?: `0x${string}`;
  canMint?: boolean;
  mintCount?: number;
}

const DEFAULT_PFP_URL = "/assets/defifa-icon.png";

export function GridCell({ cell, gs, onMint, me, canMint = false, mintCount = 0 }: GridCellProps) {
  const idx = cell.id.idx;
  const live = isLiveLeader(gs, idx);
  const hasOwners = cell.owners.length > 0;

  return (
    <button
      className={[
        "flex flex-col items-center justify-center gap-1 rounded-xl border border-neutral-700 p-2 bg-neutral-900 text-neutral-50 transition min-h-[60px] relative",
        live
          ? "bg-green-900 ring-2 ring-green-500 border-green-500"
          : "hover:border-neutral-500 hover:bg-neutral-800",
        canMint ? "cursor-pointer" : "cursor-default",
      ].join(" ")}
      onClick={() => canMint && onMint(cell)}
      disabled={!canMint}
    >
      {/* Mint count badge */}
      {mintCount > 0 && (
        <div className="absolute top-1 right-1 bg-neutral-800 text-neutral-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
          {mintCount}
        </div>
      )}
      
      {canMint && !hasOwners && (
        <span className="text-2xl font-mono text-neutral-400">+</span>
      )}
      {hasOwners && (
        <div className="flex -space-x-1 flex-wrap justify-center gap-1">
          {cell.owners.slice(0, 5).map((o, i) => {
            const pfpUrl = o.pfpUrl || DEFAULT_PFP_URL;
            console.log(`[GridCell] Owner ${i} for cell ${cell.id.idx}: address=${o.address}, pfpUrl=${pfpUrl || 'NONE'}`);
            return (
              <img
                key={`${o.address}-${i}`}
                src={pfpUrl}
                className="h-5 w-5 rounded-full border border-neutral-700"
                alt="pfp"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.warn(`[GridCell] Failed to load PFP for ${o.address} (${pfpUrl}), falling back to default`);
                  target.src = DEFAULT_PFP_URL;
                }}
                onLoad={() => {
                  if (o.pfpUrl) {
                    console.log(`[GridCell] Successfully loaded PFP for ${o.address}`);
                  }
                }}
              />
            );
          })}
          {cell.owners.length > 5 && (
            <span className="h-5 w-5 rounded-full bg-neutral-700 text-[10px] border border-neutral-600 text-neutral-400 flex items-center justify-center font-mono">
              +{cell.owners.length - 5}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

