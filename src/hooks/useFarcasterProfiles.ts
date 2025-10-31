import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

type NeynarUser = {
  username?: string;
  display_name?: string;
  pfp_url?: string;
};

type NeynarResponse = Record<string, NeynarUser[]>;

async function fetchFarcasterProfiles(addresses: string[]): Promise<NeynarResponse> {
  if (addresses.length === 0) return {};

  const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
  if (!apiKey) {
    console.warn("NEXT_PUBLIC_NEYNAR_API_KEY is not set; skipping Farcaster lookup.");
    return {};
  }

  const query = encodeURIComponent(addresses.join(','));
  const url = `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${query}`;
  console.log('neynar url', url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "x-neynar-experimental": "false",
    },
  });
  console.log('neynar response', response);
  if (!response.ok) {
    throw new Error(`Failed to fetch Farcaster profiles: ${response.status}`);
  }

  return response.json();
}

export function useFarcasterProfiles(addresses: string[]) {
  const uniqueAddresses = useMemo(
    () =>
      Array.from(
        new Set(
          addresses
            .filter(Boolean)
            .map((addr) => addr.toLowerCase())
        )
      ).slice(0, 350),
    [addresses]
  );

  return useQuery({
    queryKey: ["farcaster-profiles", uniqueAddresses],
    queryFn: () => fetchFarcasterProfiles(uniqueAddresses),
    enabled: uniqueAddresses.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
