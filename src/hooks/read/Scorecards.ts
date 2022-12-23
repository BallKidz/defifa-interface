import { Entity } from "@graphprotocol/graph-ts";
import { useEffect, useState } from "react";

const PROPOSALS_QUERY = `
query Proposals($first: Int = 0, $orderBy: String = "id", $orderDirection: String = "asc", $filter: ProposalFilter) {
  proposals(first: $first, orderBy: $orderBy, orderDirection: $orderDirection, filter: $filter) {
    contractAddress
    proposalId
    msgSender
    targets
    values
    calldatas
    snapshot
    deadline
    description
  }
}
`;

export const useProposals = (
  contractAddress: string,
  first: number,
  orderBy: string,
  orderDirection: string
) => {
  const [proposals, setProposals] = useState<Array<Entity>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch(
          "https://api.thegraph.com/subgraphs/name/openzeppelin/upgradeability-core",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: PROPOSALS_QUERY,
              variables: {
                first,
                orderBy,
                orderDirection,
                filter: {
                  contractAddress,
                  event: "ProposalCreated",
                },
              },
            }),
          }
        );

        const result = await response.json();
        const data = result.data as { proposals: Array<Entity> };
        setProposals(data.proposals);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [contractAddress, first, orderBy, orderDirection]);

  return { proposals, loading, error };
};
