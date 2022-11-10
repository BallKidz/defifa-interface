import { useAccount } from "wagmi";
import { useChainData } from "./useChainData";
import request, { gql } from "graphql-request";
import { useEffect, useState } from "react";
import { useInterval } from "./useInterval";

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

  // useInterval(() => {
  //   getTeamsAndsetTeams();
  // }, 1000);

  function removeTeams(tierIds: number[] | undefined) {
    const newTeams = teams?.filter((team) => !tierIds?.includes(team?.id));
    setTeams(newTeams);
  }

  function getTeamsAndsetTeams() {
    if (address && graphUrl) {
      request(graphUrl, myTeamsQuery, { owner: address.toLowerCase() })
        .then((data) => {
          console.log("data", data);
          const userTeams = getTeamTiersFromToken(data.tokens);
          setTeams(userTeams);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }

  const fetchMyTeams = async () => {
    setError({ isError: false, error: "" });
    if (!address) return;
    const variables = {
      owner: address?.toLowerCase(),
    };

    try {
      setIsLoading(true);
      console.log("fetching teams");
      const response: { tokens: any[] } = await request(
        graphUrl,
        myTeamsQuery,
        variables
      );
      const teamTiers = getTeamTiersFromToken(response.tokens);
      console.log("teamTiers", teamTiers);
      setTeams(teamTiers);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
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
      setTeams([]);
      return;
    }
    if (!address) return;
    fetchMyTeams();
  }, [address, isConnecting, isDisconnected, graphUrl]);

  return {
    teams,
    isLoading,
    isError: errorState?.isError,
    error: errorState?.error,
    removeTeams,
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
