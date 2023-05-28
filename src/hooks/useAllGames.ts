import { useAccount } from "wagmi";
import { useChainData } from "./useChainData";
import request, { gql } from "graphql-request";
import { useEffect, useState } from "react";
// TODO: Hardcode to start at project 800 as that was time of last deployer update
const allGamesQuery = gql`
  query myTeamsQuery {
      contracts {
        name
        address
        gameId
        tokenUriResolver
        mintedTokens {
          id
          metadata {
            description
            name
          }
        }
      }
    }
`;

export function useAllGames() {
  const { chainData } = useChainData();
  const { address, isConnecting, isDisconnected } = useAccount();
  const graphUrl = chainData.subgraph;
  const [games, setGames] = useState<Games[]>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setError] = useState<{
    isError: boolean;
    error: string;
  }>({ isError: false, error: "" });

  const fetchAllGames = async () => {
    try {
      setIsLoading(true);
      const response: {
        contracts: any;
      } = await request(graphUrl, allGamesQuery);
      setGames(response.contracts);
      setIsLoading(false);
    } catch (error) {
      setError({ error: "Something went wrong", isError: true });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnecting) {
      setIsLoading(true);
      return;
    }
    if (isDisconnected) {
      setError({ error: "Please connect your wallet", isError: true });
      setIsLoading(false);
      setGames([]);
      return;
    }
    if (!address) return;
    fetchAllGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isConnecting, isDisconnected, graphUrl]);

  return {
    games,
    isLoading,
    isError: errorState?.isError,
    error: errorState?.error,
    };
}

export interface Games {
  gameId: number;
  name: string;
  address: string;
}