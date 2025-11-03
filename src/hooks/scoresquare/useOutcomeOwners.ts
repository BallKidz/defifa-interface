import { useQuery } from "@tanstack/react-query";
import { OutcomeOwner } from "types/scoresquare";
import { useTiersApi } from "./useTiersApi";

/**
 * Resolve Farcaster profiles for a list of addresses
 */
async function resolveFarcasterProfiles(
  addresses: `0x${string}`[]
): Promise<OutcomeOwner[]> {
  if (addresses.length === 0) return [];

  const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
  if (!apiKey) {
    return addresses.map((addr) => ({ address: addr }));
  }

  const query = encodeURIComponent(addresses.join(","));
  const url = `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${query}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "x-neynar-experimental": "false",
      },
    });

    if (!response.ok) {
      return addresses.map((addr) => ({ address: addr }));
    }

    const data: Record<string, Array<{ pfp_url?: string; fid?: number }>> =
      await response.json();

    return addresses.map((addr) => {
      const profiles = data[addr.toLowerCase()];
      const profile = profiles?.[0];
      return {
        address: addr,
        fid: profile?.fid,
        pfpUrl: profile?.pfp_url,
      };
    });
  } catch (error) {
    console.warn("Failed to fetch Farcaster profiles:", error);
    return addresses.map((addr) => ({ address: addr }));
  }
}

/**
 * Hook to fetch owners for a specific tier and resolve their Farcaster profiles
 */
export function useOutcomeOwners(
  gameId: string,
  tierId: string,
  enabled: boolean = true
) {
  const api = useTiersApi();

  return useQuery({
    queryKey: ["outcome-owners", gameId, tierId],
    queryFn: async () => {
      const addresses = await api.fetchOwnersByTier(gameId, tierId);
      const owners = await resolveFarcasterProfiles(addresses);
      return owners;
    },
    enabled: enabled && !!gameId && !!tierId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 10 * 1000, // 10 seconds
  });
}

