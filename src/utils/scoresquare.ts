import { OutcomeId, LiveScore, GridState } from "types/scoresquare";

/**
 * Convert home/away score to row-major index
 * idx = home * 5 + away
 */
export const toIdx = (home: number, away: number): number => home * 5 + away;

/**
 * Convert row-major index to home/away score
 */
export const fromIdx = (idx: number): OutcomeId => ({
  home: Math.floor(idx / 5),
  away: idx % 5,
  idx,
});

/**
 * Build all 25 outcomes (0-0 to 4-4)
 */
export const buildOutcomes = (): OutcomeId[] =>
  Array.from({ length: 25 }, (_, idx) => fromIdx(idx));

/**
 * Check if a cell is the live leader (current score)
 */
export const isLiveLeader = (
  gs: GridState,
  cellIdx: number
): boolean =>
  gs.phase === "scoring" &&
  !!gs.liveScore &&
  cellIdx === toIdx(gs.liveScore.home, gs.liveScore.away);

/**
 * Mock live score feed generator
 * Cycles through plausible scores every 15 seconds
 */
export function mockLiveFeed(
  onUpdate: (s: LiveScore) => void
): () => void {
  let minute = 1;
  let h = 0;
  let a = 0;
  const seq: Array<[number, number]> = [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [2, 2],
    [3, 2],
    [3, 3],
  ];

  let i = 0;

  const t = setInterval(() => {
    const [nh, na] = seq[i % seq.length];
    i++;
    minute += 3;
    h = nh;
    a = na;

    onUpdate({ home: h, away: a, minute });
  }, 15000);

  return () => clearInterval(t);
}

