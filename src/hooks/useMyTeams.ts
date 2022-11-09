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

  const fetchMyTeams = async () => {
    if (!address) return;
    const variables = {
      owner: address?.toLowerCase(),
    };

    try {
      setIsLoading(true);
   
      const response: { tokens: any[] } = await request(
        graphUrl,
        myTeamsQuery,
        variables
      );
      const teamTiers = getTeamTiersFromToken(response.tokens);
     
      setTeams(teamTiers);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError({ error: "Something went wrong", isError: true });
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isConnecting || isDisconnected) return;
    if (!address) return;
    //query graph using graphql-request

    fetchMyTeams();
  }, [address, isConnecting, isDisconnected, graphUrl]);

  return {
    teams,
    isLoading,
    isError: errorState?.isError,
    error: errorState?.error,
    fetchMyTeams,
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
