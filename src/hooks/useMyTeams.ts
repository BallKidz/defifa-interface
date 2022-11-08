import { useAccount } from "wagmi";
import { useChainData } from "./useChainData";
import request, { gql } from "graphql-request";
import { useEffect, useState } from "react";

const myTeamsQuery = gql`
  query myTeamsQuery($owner: String!) {
    tokens(where: { owner: $owner }) {
      id
      number
      metadata {
        description
        id
        identifier
        image
        name
        tags
      }
    }
  }
`;

export function useMyTeams() {
  const { chainData } = useChainData();
  const { address, isConnecting, isDisconnected } = useAccount();
  const graphUrl = chainData.subgraph;
  const [teams, setTeams] = useState<TeamTier[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setError] = useState<{
    isError: boolean;
    error: string;
  }>();

  useEffect(() => {
    console.log("useMyTeams", address, isConnecting, isDisconnected);
    if (isConnecting || isDisconnected) return;
    if (!address) return;
    //query graph using graphql-request
    const variables = {
      owner: "0x1fc6e73075c584dbdda0e53449e2c944986b9a72" ?? address,
    };
    const fetchMyTeams = async () => {
      try {
        setIsLoading(true);
        const response: { tokens: any[] } = await request(
          graphUrl,
          myTeamsQuery,
          variables
        );
        response.tokens.push(response.tokens[1]);
        const teamTiers = getTeamTiersFromToken(response.tokens);
        console.log("teamTiers", teamTiers);
        setTeams(teamTiers);
        setIsLoading(false);
      } catch (error) {
        setError({ error: "Something went wrong", isError: true });
      }
    };
    fetchMyTeams();
  }, [address, isConnecting, isDisconnected, graphUrl]);

  return {
    teams,
    isLoading,
    isError: errorState?.isError,
    error: errorState?.error,
  };
}

export interface TeamTier {
  id: number;
  quantity: number;
  image: string;
  name: string;
  tokenIds: string[];
}

export interface Token {
  id: string;
  metadata: {
    identifier: number;
    image: string;
    tags: string[];
  };
}

function getTeamTiersFromToken(token: Token[]) {
  let userTiers = new Map<number, TeamTier>();
  token.forEach((t) => {
    if (userTiers.has(t.metadata.identifier)) {
      const teamTier = userTiers.get(t.metadata.identifier);
      teamTier!.quantity++;
      teamTier!.tokenIds.push(t.id);
    } else {
      userTiers.set(t.metadata.identifier, {
        id: t.metadata.identifier,
        quantity: 1,
        image: t.metadata.image,
        name: t.metadata.tags[1],
        tokenIds: [t.id],
      });
    }
  });

  return Array.from(userTiers.values());
}
