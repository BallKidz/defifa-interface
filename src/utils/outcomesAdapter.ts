import { OutcomeId } from "types/scoresquare";
import { toIdx } from "./scoresquare";

export interface TiersApi {
  fetchTiers(gameId: string): Promise<Array<{ id: string; name?: string }>>;
  fetchOwnersByTier(
    gameId: string,
    tierId: string
  ): Promise<`0x${string}`[]>;
}

export interface OutcomesAdapter {
  outcomeToTierId(o: OutcomeId): string;
  tierIdToOutcome(tierId: string): OutcomeId | null;
}

/**
 * Build an adapter that maps outcomes (home/away scores) to tier IDs
 * Strategy A: Parse metadata name like "SS:2-1" (e.g., SS:h-a)
 * Strategy B: Fallback to deterministic tier ordering for 25 outcomes
 */
export async function buildAdapter(
  gameId: string,
  api: TiersApi
): Promise<OutcomesAdapter> {
  const tiers = await api.fetchTiers(gameId);

  // Strategy A: parse metadata name formats:
  // - "SS:h-a" (preferred format)
  // - "h-a" (direct format like "0-0", "1-1")
  // - "h-a+" (4+ format like "0-4+", "1-4+")
  // - "+4-h" (4+ format like "+4-0", "+4-1")
  // - "+4-4+" (4+ format)
  const ss = new Map<string, string>();

  for (const t of tiers) {
    if (!t.name) continue;
    
    // Try SS:h-a format first
    let m = t.name.match(/^SS:(\d)-(\d)$/);
    if (m) {
      const home = Number(m[1]);
      const away = Number(m[2]);
      if (home >= 0 && home <= 4 && away >= 0 && away <= 4) {
        ss.set(String(toIdx(home, away)), t.id);
        continue;
      }
    }
    
    // Try +4-h format (like "+4-0", "+4-1", "+4-4+")
    m = t.name.match(/^\+4-(\d)\+?$/);
    if (m) {
      const away = Number(m[1]);
      if (away >= 0 && away <= 4) {
        ss.set(String(toIdx(4, away)), t.id);
        continue;
      }
    }
    
    // Try h-a+ format (like "0-4+", "1-4+", "2-4+")
    m = t.name.match(/^(\d)-4\+$/);
    if (m) {
      const home = Number(m[1]);
      if (home >= 0 && home <= 4) {
        ss.set(String(toIdx(home, 4)), t.id);
        continue;
      }
    }
    
    // Try standard h-a format (like "0-0", "1-1", "2-3")
    m = t.name.match(/^(\d)-(\d)$/);
    if (m) {
      const home = Number(m[1]);
      const away = Number(m[2]);
      if (home >= 0 && home <= 4 && away >= 0 && away <= 4) {
        ss.set(String(toIdx(home, away)), t.id);
        continue;
      }
    }
  }

  // Strategy B: fallback deterministic order if A incomplete
  if (ss.size < 25) {
    // Sort tiers by id asc (or provided order) & fill 0-0..4-4
    const ordered = [...tiers].sort((a, b) => {
      const aId = Number(a.id);
      const bId = Number(b.id);
      return aId - bId;
    });
    ordered.slice(0, 25).forEach((t, idx) => {
      if (!ss.has(String(idx))) {
        ss.set(String(idx), t.id);
      }
    });
  }

  return {
    outcomeToTierId: (o) => {
      const key = String(toIdx(o.home, o.away));
      const tierId = ss.get(key);
      if (!tierId) {
        throw new Error(`No tier ID found for outcome ${o.home}-${o.away}`);
      }
      return tierId;
    },
    tierIdToOutcome: (tierId) => {
      for (const [k, v] of ss.entries()) {
        if (v === tierId) {
          return {
            home: Math.floor(Number(k) / 5),
            away: Number(k) % 5,
            idx: Number(k),
          };
        }
      }
      return null;
    },
  };
}

