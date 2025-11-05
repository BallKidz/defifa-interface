import { useGameContext } from "contexts/GameContext";
import { useAccount } from "wagmi";
import { useGameMints } from "./useGameMints";
import { useMemo } from "react";

export function useMyMints() {
  const { address } = useAccount();
  const { gameId, currentPhase } = useGameContext();
  const { data: gameMints, isLoading, error } = useGameMints(gameId, undefined, {
    currentPhase,
  });

  // Filter game mints to only include user's mints
  const myMints = useMemo(() => {
    if (!address || !gameMints) {
      return undefined;
    }

    const userMints = gameMints.filter(
      (token: any) => token.owner.id.toLowerCase() === address.toLowerCase()
    );

    // Maintain the same structure that components expect
    return {
      contracts: [{
        mintedTokens: userMints
      }]
    };
  }, [address, gameMints]);

  return {
    data: myMints,
    isLoading,
    error,
  };
}
