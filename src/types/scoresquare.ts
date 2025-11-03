export type ChainAndId = string; // e.g. "sep:105"

export interface OutcomeId {
  home: number;
  away: number;
  idx: number;
}

export interface OutcomeOwner {
  address: `0x${string}`;
  fid?: number;
  pfpUrl?: string;
}

export interface OutcomeCell {
  id: OutcomeId;
  tierId: string;
  owners: OutcomeOwner[];
}

export interface GridState {
  gameId: ChainAndId;
  cells: OutcomeCell[];
  phase: "minting" | "scoring" | "final";
  liveScore?: { home: number; away: number; minute: number };
}

export type LiveScore = { home: number; away: number; minute: number };

